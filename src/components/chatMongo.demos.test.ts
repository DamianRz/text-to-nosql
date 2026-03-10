import { demosByLanguage } from "./chatMongo.demos";
import { parseNaturalLanguageToMongo } from "@/server/nl/parseNaturalLanguage";
import { createSeededSimulatedMongoDb, executeMongoOperationOnSimulatedState } from "@/client/localDb/simulatedMongoDb";
import type { JsonObject } from "@/types/mongo";

const stripIds = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(stripIds);
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== "_id")
      .map(([key, nested]) => [key, stripIds(nested)]);
    return Object.fromEntries(entries);
  }

  return value;
};

describe("chatMongo demos", () => {
  test("includes four demos for each supported action", () => {
    const counts = demosByLanguage.es.reduce<Record<string, number>>((accumulator, demo) => {
      accumulator[demo.action] = (accumulator[demo.action] ?? 0) + 1;
      return accumulator;
    }, {});

    expect(counts).toEqual({
      find: 4,
      count: 4,
      insertOne: 4,
      updateMany: 4,
      deleteMany: 4
    });
  });

  test.each(["es", "en"] as const)("parses every %s demo into the expected action and collection", async (language) => {
    for (const demo of demosByLanguage[language]) {
      const parsed = await parseNaturalLanguageToMongo(demo.text);
      expect(parsed.errors).toEqual([]);
      expect(parsed.operation?.action).toBe(demo.operation.action);
      expect(parsed.operation?.collection).toBe(demo.operation.collection);
    }
  });

  test("each Spanish demo produces the expected result on the seeded database", () => {
    for (const demo of demosByLanguage.es) {
      const execution = executeMongoOperationOnSimulatedState(createSeededSimulatedMongoDb(), demo.operation);

      if (demo.action === "find") {
        expect(stripIds(execution.result)).toEqual(stripIds(demo.mockResult));
        continue;
      }

      if (demo.action === "insertOne") {
        const result = execution.result as { acknowledged: boolean; insertedId?: string };
        const nextCollection = execution.nextState.collections[demo.operation.collection] ?? [];
        const insertedDocument = nextCollection[nextCollection.length - 1] as JsonObject;

        expect(result.acknowledged).toBe(true);
        expect(result.insertedId).toEqual(expect.any(String));
        expect(stripIds(insertedDocument)).toEqual(demo.operation.document);
        continue;
      }

      expect(execution.result).toEqual(demo.mockResult);
    }
  });
});
