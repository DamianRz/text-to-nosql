import type { Db } from "mongodb";
import type { MongoOperation } from "@/types/mongo";

export const executeMongoOperation = async (db: Db, operation: MongoOperation): Promise<unknown> => {
  const collection = db.collection(operation.collection);

  if (operation.action === "find") {
    const cursor = collection.find(operation.filter ?? {}, {
      projection: (operation.projection ?? undefined) as Record<string, 1 | 0> | undefined
    });

    if (operation.sort) {
      cursor.sort(operation.sort as Record<string, 1 | -1>);
    }

    if (operation.limit && operation.limit > 0) {
      cursor.limit(operation.limit);
    }

    return cursor.toArray();
  }

  if (operation.action === "count") {
    const total = await collection.countDocuments(operation.filter ?? {});
    return { total };
  }

  if (operation.action === "insertOne") {
    const result = await collection.insertOne(operation.document ?? {});
    return {
      acknowledged: result.acknowledged,
      insertedId: result.insertedId.toString()
    };
  }

  if (operation.action === "updateMany") {
    const result = await collection.updateMany(operation.filter ?? {}, operation.update ?? {});
    return {
      acknowledged: result.acknowledged,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    };
  }

  const result = await collection.deleteMany(operation.filter ?? {});
  return {
    acknowledged: result.acknowledged,
    deletedCount: result.deletedCount
  };
};
