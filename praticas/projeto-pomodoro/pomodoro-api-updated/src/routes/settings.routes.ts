import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middlewares/auth';

export const settingsRouter = Router();

settingsRouter.use(requireAuth);

// GET /settings — retorna settings (cria defaults se não existir)
settingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    let settings = await prisma.settings.findUnique({
      where: { userId: req.user!.id },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          userId: req.user!.id,
          workTime: 25,
          shortBreakTime: 5,
          longBreakTime: 15,
        },
      });
    }

    return res.json(settings);
  } catch (error) {
    console.error('Erro ao buscar settings:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PUT /settings — atualiza settings
settingsRouter.put('/', async (req: Request, res: Response) => {
  try {
    const { workTime, shortBreakTime, longBreakTime } = req.body as {
      workTime: number;
      shortBreakTime: number;
      longBreakTime: number;
    };

    if (
      !Number.isInteger(workTime) ||
      !Number.isInteger(shortBreakTime) ||
      !Number.isInteger(longBreakTime)
    ) {
      return res.status(400).json({ message: 'Valores inválidos: workTime, shortBreakTime e longBreakTime devem ser inteiros.' });
    }

    if (workTime < 1 || workTime > 120) {
      return res.status(400).json({ message: 'workTime deve estar entre 1 e 120 minutos.' });
    }

    if (shortBreakTime < 1 || shortBreakTime > 30) {
      return res.status(400).json({ message: 'shortBreakTime deve estar entre 1 e 30 minutos.' });
    }

    if (longBreakTime < 1 || longBreakTime > 60) {
      return res.status(400).json({ message: 'longBreakTime deve estar entre 1 e 60 minutos.' });
    }

    const settings = await prisma.settings.upsert({
      where: { userId: req.user!.id },
      update: { workTime, shortBreakTime, longBreakTime },
      create: {
        userId: req.user!.id,
        workTime,
        shortBreakTime,
        longBreakTime,
      },
    });

    return res.json(settings);
  } catch (error) {
    console.error('Erro ao atualizar settings:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});
