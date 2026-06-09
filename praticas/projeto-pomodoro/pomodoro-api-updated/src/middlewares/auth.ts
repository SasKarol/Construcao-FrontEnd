import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { hashToken } from '../lib/security';

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;
  const [, token] = authorization?.split(' ') ?? [];

  if (!token) {
    return res.status(401).json({ message: 'Sessao nao informada.' });
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    return res.status(401).json({ message: 'Sessao invalida ou expirada.' });
  }

  req.user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

  return next();
}
