import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import {
  createToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from '../lib/security';
import { requireAuth } from '../middlewares/auth';

export const authRouter = Router();

function sanitizeUser(user: { id: string; name: string; email: string }) {
  return { id: user.id, name: user.name, email: user.email };
}

function normalizeEmail(email: unknown) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

async function createSession(userId: string) {
  const token = createToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.session.create({
    data: { userId, tokenHash: hashToken(token), expiresAt },
  });

  return { token, expiresAt };
}

authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body as { name?: string; password?: string };
    const email = normalizeEmail(req.body.email);
    const cleanName = name?.trim() ?? '';

    if (cleanName.length < 2) {
      return res.status(400).json({ message: 'Informe um nome valido.' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Informe um e-mail valido.' });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const user = await prisma.user.create({
      data: {
        name: cleanName,
        email,
        passwordHash: hashPassword(password),
        settings: {
          create: { workTime: 25, shortBreakTime: 5, longBreakTime: 15 },
        },
      },
    });
    const session = await createSession(user.id);

    return res.status(201).json({ user: sanitizeUser(user), ...session });
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return res.status(409).json({ message: 'E-mail ja cadastrado.' });
    }

    console.error('Erro ao cadastrar usuario:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body as { password?: string };

    if (!email || !password) {
      return res.status(400).json({ message: 'Informe e-mail e senha.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: 'E-mail ou senha invalidos.' });
    }

    const session = await createSession(user.id);
    return res.json({ user: sanitizeUser(user), ...session });
  } catch (error) {
    console.error('Erro ao autenticar usuario:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

authRouter.get('/me', requireAuth, (req: Request, res: Response) => {
  return res.json({ user: req.user });
});

authRouter.post('/logout', requireAuth, async (req: Request, res: Response) => {
  const [, token] = req.headers.authorization?.split(' ') ?? [];

  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }

  return res.status(204).send();
});

authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({
        message:
          'Se o e-mail existir, um token de recuperacao sera gerado em ambiente de laboratorio.',
      });
    }

    const resetToken = createToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(resetToken),
        expiresAt,
      },
    });

    return res.json({
      message: 'Token de recuperacao gerado.',
      resetToken,
      expiresAt,
    });
  } catch (error) {
    console.error('Erro ao recuperar senha:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

authRouter.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body as { token?: string; password?: string };

    if (!token || !password || password.length < 6) {
      return res.status(400).json({
        message: 'Informe o token e uma nova senha com pelo menos 6 caracteres.',
      });
    }

    const reset = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });

    if (!reset || reset.usedAt || reset.expiresAt <= new Date()) {
      return res.status(400).json({ message: 'Token invalido ou expirado.' });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: reset.userId },
        data: { passwordHash: hashPassword(password) },
      }),
      prisma.passwordResetToken.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
      prisma.session.deleteMany({ where: { userId: reset.userId } }),
    ]);

    return res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});
