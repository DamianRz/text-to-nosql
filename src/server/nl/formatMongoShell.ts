import type { JsonObject, MongoOperation } from "@/types/mongo";

const toJson = (value: JsonObject | undefined): string => JSON.stringify(value ?? {}, null, 2);

export const formatMongoShell = (operation: MongoOperation): string => {
  const collectionRef = `db.${operation.collection}`;

  if (operation.action === "find") {
    const limit = operation.limit ?? 50;
    return `${collectionRef}.find(${toJson(operation.filter)}).limit(${limit})`;
  }

  if (operation.action === "count") {
    return `${collectionRef}.countDocuments(${toJson(operation.filter)})`;
  }

  if (operation.action === "insertOne") {
    return `${collectionRef}.insertOne(${toJson(operation.document)})`;
  }

  if (operation.action === "updateMany") {
    return `${collectionRef}.updateMany(${toJson(operation.filter)}, ${toJson(operation.update)})`;
  }

  return `${collectionRef}.deleteMany(${toJson(operation.filter)})`;
};
