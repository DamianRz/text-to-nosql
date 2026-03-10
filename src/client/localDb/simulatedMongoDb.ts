"use client";

import type { JsonObject, MongoOperation } from "@/types/mongo";

export interface SimulatedMongoDatabaseState {
  collections: Record<string, JsonObject[]>;
}

const STORAGE_KEY = "chatmongo-simulated-db";

const createId = (): string => `sim_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const seedState = (): SimulatedMongoDatabaseState => ({
  collections: {
    transactions: [
      { _id: createId(), category: "comida", amount: 18, demoTag: "chat-demo", createdAt: "2026-03-07T12:00:00.000Z" },
      { _id: createId(), category: "transporte", amount: 32, demoTag: "chat-demo", createdAt: "2026-03-08T09:30:00.000Z" },
      { _id: createId(), category: "demo_ui", amount: 120, demoTag: "chat-demo", createdAt: "2026-03-09T15:45:00.000Z" },
      { _id: createId(), category: "salud", amount: 45, demoTag: "seed", createdAt: "2026-03-09T17:20:00.000Z" },
      { _id: createId(), category: "ocio", amount: 67, demoTag: "seed", createdAt: "2026-03-06T19:10:00.000Z" },
      { _id: createId(), category: "software", amount: 240, demoTag: "seed", createdAt: "2026-03-05T10:15:00.000Z" },
      { _id: createId(), category: "infra", amount: 980, demoTag: "seed", createdAt: "2026-03-04T08:05:00.000Z" },
      { _id: createId(), category: "marketing", amount: 154, demoTag: "seed", createdAt: "2026-03-03T11:25:00.000Z" },
      { _id: createId(), category: "ventas", amount: 312, demoTag: "seed", createdAt: "2026-03-02T13:40:00.000Z" },
      { _id: createId(), category: "rrhh", amount: 72, demoTag: "seed", createdAt: "2026-03-01T16:30:00.000Z" },
      { _id: createId(), category: "logistica", amount: 430, demoTag: "seed", createdAt: "2026-02-28T09:50:00.000Z" },
      { _id: createId(), category: "seguridad", amount: 88, demoTag: "seed", createdAt: "2026-02-27T07:45:00.000Z" }
    ],
    users: [
      { _id: createId(), name: "Ana", active: true, role: "analyst", plan: "pro" },
      { _id: createId(), name: "Luis", active: false, role: "viewer", plan: "free" },
      { _id: createId(), name: "Marta", active: true, role: "admin", plan: "enterprise" },
      { _id: createId(), name: "Diego", active: true, role: "engineer", plan: "team" },
      { _id: createId(), name: "Sofia", active: true, role: "pm", plan: "pro" }
    ],
    products: [
      { _id: createId(), sku: "PRD-001", name: "Notebook", price: 1299, stock: 14 },
      { _id: createId(), sku: "PRD-002", name: "Mouse", price: 39, stock: 120 },
      { _id: createId(), sku: "PRD-003", name: "Monitor", price: 420, stock: 23 }
    ],
    audit_logs: [
      { _id: createId(), type: "query_generated", source: "llm", collection: "transactions", createdAt: "2026-03-09T18:10:00.000Z" },
      { _id: createId(), type: "query_executed", source: "simulated-db", collection: "users", createdAt: "2026-03-09T18:15:00.000Z" }
    ]
  }
});

export const createSeededSimulatedMongoDb = (): SimulatedMongoDatabaseState => seedState();

const isObject = (value: unknown): value is JsonObject => typeof value === "object" && value !== null && !Array.isArray(value);

const getFieldValue = (document: JsonObject, path: string): unknown =>
  path.split(".").reduce<unknown>((current, segment) => {
    if (!isObject(current)) {
      return undefined;
    }

    return current[segment];
  }, document);

const matchesCondition = (actual: unknown, expected: unknown): boolean => {
  if (isObject(expected)) {
    return Object.entries(expected).every(([operator, operand]) => {
      if (operator === "$in" && Array.isArray(operand)) {
        return operand.includes(actual);
      }

      if (typeof actual === "number" && typeof operand === "number") {
        if (operator === "$gt") {
          return actual > operand;
        }
        if (operator === "$gte") {
          return actual >= operand;
        }
        if (operator === "$lt") {
          return actual < operand;
        }
        if (operator === "$lte") {
          return actual <= operand;
        }
      }

      if (typeof actual === "string" && typeof operand === "string") {
        if (operator === "$gt") {
          return actual > operand;
        }
        if (operator === "$gte") {
          return actual >= operand;
        }
        if (operator === "$lt") {
          return actual < operand;
        }
        if (operator === "$lte") {
          return actual <= operand;
        }
      }

      return false;
    });
  }

  return actual === expected;
};

const matchesFilter = (document: JsonObject, filter: JsonObject): boolean =>
  Object.entries(filter).every(([field, expected]) => matchesCondition(getFieldValue(document, field), expected));

const applyProjection = (document: JsonObject, projection?: JsonObject): JsonObject => {
  if (!projection || Object.keys(projection).length === 0) {
    return clone(document);
  }

  const includedFields = Object.entries(projection)
    .filter(([, value]) => value === 1)
    .map(([field]) => field);

  if (includedFields.length > 0) {
    const projected: JsonObject = {};
    includedFields.forEach((field) => {
      const value = getFieldValue(document, field);
      if (value !== undefined) {
        projected[field] = value;
      }
    });
    return projected;
  }

  const cloned = clone(document);
  Object.entries(projection).forEach(([field, value]) => {
    if (value === 0) {
      delete cloned[field];
    }
  });
  return cloned;
};

const applySort = (documents: JsonObject[], sort?: JsonObject): JsonObject[] => {
  if (!sort || Object.keys(sort).length === 0) {
    return documents;
  }

  const sortEntries = Object.entries(sort);
  return [...documents].sort((left, right) => {
    for (const [field, directionValue] of sortEntries) {
      const direction = directionValue === -1 ? -1 : 1;
      const leftValue = getFieldValue(left, field);
      const rightValue = getFieldValue(right, field);

      if (leftValue === rightValue) {
        continue;
      }

      if (leftValue == null) {
        return 1;
      }

      if (rightValue == null) {
        return -1;
      }

      if (leftValue > rightValue) {
        return direction;
      }

      if (leftValue < rightValue) {
        return direction * -1;
      }
    }

    return 0;
  });
};

const withCollection = (state: SimulatedMongoDatabaseState, collection: string): JsonObject[] => state.collections[collection] ?? [];

export const executeMongoOperationOnSimulatedState = (
  state: SimulatedMongoDatabaseState,
  operation: MongoOperation
): { nextState: SimulatedMongoDatabaseState; result: unknown } => {
  const currentCollection = withCollection(state, operation.collection);
  const filter = operation.filter ?? {};

  if (operation.action === "find") {
    const matching = currentCollection.filter((document) => matchesFilter(document, filter));
    const sorted = applySort(matching, operation.sort);
    const limited = operation.limit && operation.limit > 0 ? sorted.slice(0, operation.limit) : sorted;
    return {
      nextState: state,
      result: limited.map((document) => applyProjection(document, operation.projection))
    };
  }

  if (operation.action === "count") {
    return {
      nextState: state,
      result: { total: currentCollection.filter((document) => matchesFilter(document, filter)).length }
    };
  }

  if (operation.action === "insertOne") {
    const document = clone(operation.document ?? {});
    const nextDocument = { _id: createId(), ...document };
    return {
      nextState: {
        collections: {
          ...state.collections,
          [operation.collection]: [...currentCollection, nextDocument]
        }
      },
      result: {
        acknowledged: true,
        insertedId: String(nextDocument._id)
      }
    };
  }

  if (operation.action === "updateMany") {
    const updateSet = isObject(operation.update?.$set) ? operation.update.$set : {};
    let matchedCount = 0;
    let modifiedCount = 0;

    const nextCollection = currentCollection.map((document) => {
      if (!matchesFilter(document, filter)) {
        return document;
      }

      matchedCount += 1;
      const updatedDocument = { ...document, ...updateSet };
      if (JSON.stringify(updatedDocument) !== JSON.stringify(document)) {
        modifiedCount += 1;
      }
      return updatedDocument;
    });

    return {
      nextState: {
        collections: {
          ...state.collections,
          [operation.collection]: nextCollection
        }
      },
      result: {
        acknowledged: true,
        matchedCount,
        modifiedCount
      }
    };
  }

  const remainingDocuments = currentCollection.filter((document) => !matchesFilter(document, filter));
  return {
    nextState: {
      collections: {
        ...state.collections,
        [operation.collection]: remainingDocuments
      }
    },
    result: {
      acknowledged: true,
      deletedCount: currentCollection.length - remainingDocuments.length
    }
  };
};

const canUseSessionStorage = (): boolean => typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

export const initializeSimulatedMongoDb = (): SimulatedMongoDatabaseState => {
  if (!canUseSessionStorage()) {
    return createSeededSimulatedMongoDb();
  }

  const stored = window.sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as SimulatedMongoDatabaseState;
    } catch {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  const seeded = createSeededSimulatedMongoDb();
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

export const readSimulatedMongoDb = (): SimulatedMongoDatabaseState => initializeSimulatedMongoDb();

export const executeLocalMongoOperation = async (operation: MongoOperation): Promise<unknown> => {
  const currentState = initializeSimulatedMongoDb();
  const execution = executeMongoOperationOnSimulatedState(currentState, operation);

  if (canUseSessionStorage()) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(execution.nextState));
  }

  return execution.result;
};
