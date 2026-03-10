import type { MongoIntent, MongoOperation } from "@/types/mongo";

export interface BuildMongoOperationResult {
  operation?: MongoOperation;
  errors: string[];
}

const getFirstJson = (intent: MongoIntent): Record<string, unknown> | undefined => {
  const candidate = intent.jsonBlocks[0];
  return candidate && typeof candidate === "object" && !Array.isArray(candidate)
    ? (candidate as Record<string, unknown>)
    : undefined;
};

const getSecondJson = (intent: MongoIntent): Record<string, unknown> | undefined => {
  const candidate = intent.jsonBlocks[1];
  return candidate && typeof candidate === "object" && !Array.isArray(candidate)
    ? (candidate as Record<string, unknown>)
    : undefined;
};

const buildFindOperation = (intent: MongoIntent): MongoOperation => {
  const operation: MongoOperation = {
    action: "find",
    collection: intent.collection ?? "transactions",
    filter: intent.filter ?? {},
    limit: intent.limit ?? 50
  };

  if (intent.projection) {
    operation.projection = intent.projection;
  }

  if (intent.sort) {
    operation.sort = intent.sort;
  }

  return operation;
};

const buildCountOperation = (intent: MongoIntent): MongoOperation => ({
  action: "count",
  collection: intent.collection ?? "transactions",
  filter: getFirstJson(intent) ?? intent.filter ?? {}
});

export const buildMongoOperation = (intent: MongoIntent): BuildMongoOperationResult => {
  if (!intent.action) {
    return {
      errors: ["No pude detectar la accion Mongo. Usa verbos como buscar, contar, insertar, actualizar o eliminar."]
    };
  }

  if (!intent.collection) {
    return {
      errors: ["No pude detectar la coleccion objetivo."]
    };
  }

  if (intent.action === "find") {
    return { operation: buildFindOperation(intent), errors: [] };
  }

  if (intent.action === "count") {
    return { operation: buildCountOperation(intent), errors: [] };
  }

  if (intent.action === "insertOne") {
    const document = getFirstJson(intent);
    if (!document) {
      return {
        errors: ['Para insertar debes incluir un documento JSON, por ejemplo {"monto": 25}.']
      };
    }

    return {
      operation: {
        action: "insertOne",
        collection: intent.collection,
        document
      },
      errors: []
    };
  }

  if (intent.action === "updateMany") {
    const firstJson = getFirstJson(intent);
    const secondJson = getSecondJson(intent);
    const filter = firstJson ?? intent.filter ?? {};
    const update = secondJson ?? (firstJson && Object.keys(firstJson).some((key) => key.startsWith("$")) ? firstJson : undefined);

    if (!update) {
      return {
        errors: ['Para actualizar debes incluir filtro y update en JSON, por ejemplo {"categoria":"comida"} {"$set":{"monto":30}}.']
      };
    }

    return {
      operation: {
        action: "updateMany",
        collection: intent.collection,
        filter,
        update
      },
      errors: []
    };
  }

  const deleteFilter = getFirstJson(intent) ?? intent.filter ?? {};
  if (Object.keys(deleteFilter).length === 0) {
    return {
      errors: ["Para eliminar debes especificar un filtro con 'donde' o JSON."]
    };
  }

  return {
    operation: {
      action: "deleteMany",
      collection: intent.collection,
      filter: deleteFilter
    },
    errors: []
  };
};
