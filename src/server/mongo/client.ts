import { Db, MongoClient } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;
let connectionKey = "";

const readMongoConfig = () => {
  const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017";
  const dbName = process.env.MONGO_DB ?? "refactor";
  return { uri, dbName, key: `${uri}::${dbName}` };
};

export const getMongoDb = async (): Promise<Db> => {
  const config = readMongoConfig();

  if (db && client && connectionKey === config.key) {
    return db;
  }

  if (client && connectionKey !== config.key) {
    await client.close();
    client = null;
    db = null;
  }

  if (!client) {
    client = new MongoClient(config.uri);
    await client.connect();
    db = client.db(config.dbName);
    connectionKey = config.key;
  }

  return db as Db;
};

export const closeMongoConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
  }

  client = null;
  db = null;
  connectionKey = "";
};
