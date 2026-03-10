import { executeMongoOperationOnSimulatedState } from "./simulatedMongoDb";

describe("executeMongoOperationOnSimulatedState", () => {
  const baseState = {
    collections: {
      transactions: [
        { _id: "1", category: "comida", amount: 10, demoTag: "chat-demo" },
        { _id: "2", category: "transporte", amount: 20, demoTag: "chat-demo" },
        { _id: "3", category: "comida", amount: 35, demoTag: "archive" }
      ]
    }
  };

  test("finds and limits simulated documents", () => {
    const execution = executeMongoOperationOnSimulatedState(baseState, {
      action: "find",
      collection: "transactions",
      filter: { category: "comida" },
      sort: { amount: -1 },
      limit: 1
    });

    expect(execution.result).toEqual([{ _id: "3", category: "comida", amount: 35, demoTag: "archive" }]);
  });

  test("counts simulated documents", () => {
    const execution = executeMongoOperationOnSimulatedState(baseState, {
      action: "count",
      collection: "transactions",
      filter: { demoTag: "chat-demo" }
    });

    expect(execution.result).toEqual({ total: 2 });
  });

  test("inserts, updates and deletes in simulated state", () => {
    const inserted = executeMongoOperationOnSimulatedState(baseState, {
      action: "insertOne",
      collection: "transactions",
      document: { category: "salud", amount: 50 }
    });

    expect((inserted.result as { insertedId: string }).insertedId).toBeTruthy();

    const updated = executeMongoOperationOnSimulatedState(inserted.nextState, {
      action: "updateMany",
      collection: "transactions",
      filter: { category: "salud" },
      update: { $set: { amount: 70 } }
    });

    expect(updated.result).toEqual({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1
    });

    const removed = executeMongoOperationOnSimulatedState(updated.nextState, {
      action: "deleteMany",
      collection: "transactions",
      filter: { category: "salud" }
    });

    expect(removed.result).toEqual({
      acknowledged: true,
      deletedCount: 1
    });
  });
});
