import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const URI =
  process.env.MONGO_URI ??
  'mongodb://localhost:27017,localhost:27018,localhost:27019/midb?replicaSet=rs0';

const options: MongoClientOptions = {
  // --- Pool por instancia: clave para no saturar la réplica ---
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,

  // --- Timeouts explícitos ---
  connectTimeoutMS: 5000,
  socketTimeoutMS: 20000,
  serverSelectionTimeoutMS: 5000,

  // --- Reparto de lectura entre secundarios ---
  readPreference: 'secondaryPreferred',
  readConcernLevel: 'local',
  maxStalenessSeconds: 90,

  retryReads: true,
};

let client: MongoClient | undefined;
let db: Db | undefined;

export async function connectDB(): Promise<Db> {
  client = new MongoClient(URI, options);
  await client.connect();
  db = client.db('midb');
  console.log(`[PID ${process.pid}] conectado a MongoDB`);
  return db;
}

export function getDB(): Db {
  if (!db) {
    throw new Error('DB no inicializada, llama a connectDB() primero');
  }
  return db;
}

export async function closeDB(): Promise<void> {
  await client?.close();
}