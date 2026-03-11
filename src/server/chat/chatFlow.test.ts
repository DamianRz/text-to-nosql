import { MongoMemoryServer } from "mongodb-memory-server";
import { createChatResponse } from "./createChatResponse";
import { closeMongoConnection, getMongoDb } from "@/server/mongo/client";
import { executeMongoOperation } from "@/server/mongo/executeMongoOperation";

const describeWithMongoMemoryServer = process.platform === "android" ? describe.skip : describe;

describeWithMongoMemoryServer("chat flow e2e-like", () => {
  let mongoServer: MongoMemoryServer | null = null;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongoServer.getUri();
    process.env.MONGO_DB = "test_flow";
  });

  beforeEach(async () => {
    const db = await getMongoDb();
    await db.collection("transactions").deleteMany({});
    await db.collection("transactions").insertMany([
      { category: "comida", amount: 10 },
      { category: "comida", amount: 5 },
      { category: "hogar", amount: 30 }
    ]);
  });

  afterAll(async () => {
    await closeMongoConnection();
    await mongoServer?.stop();
  });

  test("natural text -> operation -> result", async () => {
    const chatResponse = await createChatResponse("contar en transactions donde category = comida");

    expect(chatResponse.ok).toBe(true);
    expect(chatResponse.operation).toBeDefined();

    const db = await getMongoDb();
    const result = (await executeMongoOperation(db, chatResponse.operation!)) as { total: number };

    expect(result.total).toBe(2);
  });
});
