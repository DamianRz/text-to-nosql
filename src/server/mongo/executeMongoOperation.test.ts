import { MongoMemoryServer } from "mongodb-memory-server";
import { closeMongoConnection, getMongoDb } from "./client";
import { executeMongoOperation } from "./executeMongoOperation";

const describeWithMongoMemoryServer = process.platform === "android" ? describe.skip : describe;

describeWithMongoMemoryServer("executeMongoOperation", () => {
  let mongoServer: MongoMemoryServer | null = null;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    process.env.MONGO_DB = "test_execute";
  });

  beforeEach(async () => {
    const db = await getMongoDb();
    await db.collection("transactions").deleteMany({});
    await db.collection("transactions").insertMany([
      { category: "comida", amount: 10 },
      { category: "transporte", amount: 20 },
      { category: "comida", amount: 35 }
    ]);
  });

  afterAll(async () => {
    await closeMongoConnection();
    await mongoServer?.stop();
  });

  test("executes find", async () => {
    const db = await getMongoDb();
    const result = await executeMongoOperation(db, {
      action: "find",
      collection: "transactions",
      filter: { category: "comida" }
    });

    expect(Array.isArray(result)).toBe(true);
    expect((result as Array<{ category: string }>).length).toBe(2);
  });

  test("executes count", async () => {
    const db = await getMongoDb();
    const result = (await executeMongoOperation(db, {
      action: "count",
      collection: "transactions",
      filter: { category: "comida" }
    })) as { total: number };

    expect(result.total).toBe(2);
  });

  test("executes insert, update, and delete", async () => {
    const db = await getMongoDb();

    const insert = (await executeMongoOperation(db, {
      action: "insertOne",
      collection: "transactions",
      document: { category: "salud", amount: 50 }
    })) as { insertedId: string };

    expect(insert.insertedId).toBeTruthy();

    const update = (await executeMongoOperation(db, {
      action: "updateMany",
      collection: "transactions",
      filter: { category: "salud" },
      update: { $set: { amount: 70 } }
    })) as { modifiedCount: number };

    expect(update.modifiedCount).toBe(1);

    const remove = (await executeMongoOperation(db, {
      action: "deleteMany",
      collection: "transactions",
      filter: { category: "salud" }
    })) as { deletedCount: number };

    expect(remove.deletedCount).toBe(1);
  });
});
