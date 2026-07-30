import 'dotenv/config';
import express, { Request, Response } from 'express';
import { Server } from 'http';
import { ObjectId } from 'mongodb';
import { connectDB, getDB, closeDB } from './db';
import { Item } from './types';

interface ItemParams {
  id: string;
}

const app = express();

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('ok');
});

app.get('/items/:id', async (req: Request<ItemParams>, res: Response) => {
  try {
    const db = getDB();
    const item = await db.collection<Item>('items').findOne({ _id: req.params.id });

    if (!item) {
      return res.status(404).json({ error: 'no encontrado' });
    }
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error interno' });
  }
});

const PORT = Number(process.env.PORT) || 3000;

async function start(): Promise<void> {
  await connectDB();

  const server: Server = app.listen(PORT, () => {
    console.log(`[PID ${process.pid}] escuchando en ${PORT}`);
    if (process.send) process.send('ready');
  });

  const shutdown = async (): Promise<void> => {
    console.log(`[PID ${process.pid}] cerrando...`);
    server.close(async () => {
      await closeDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  console.error('Error al iniciar el servicio:', err);
  process.exit(1);
});