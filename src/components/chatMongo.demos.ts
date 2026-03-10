import type { DemoCase, Language } from "./chatMongo.types";
import type { MongoOperation } from "@/types/mongo";

const formatDemoMongoShell = (operation: MongoOperation): string => {
  const collectionRef = `db.${operation.collection}`;

  if (operation.action === "find") {
    return `${collectionRef}.find(${JSON.stringify(operation.filter ?? {})}).limit(${operation.limit ?? 50})`;
  }

  if (operation.action === "count") {
    return `${collectionRef}.countDocuments(${JSON.stringify(operation.filter ?? {})})`;
  }

  if (operation.action === "insertOne") {
    return `${collectionRef}.insertOne(${JSON.stringify(operation.document ?? {})})`;
  }

  if (operation.action === "updateMany") {
    return `${collectionRef}.updateMany(${JSON.stringify(operation.filter ?? {})}, ${JSON.stringify(operation.update ?? {})})`;
  }

  return `${collectionRef}.deleteMany(${JSON.stringify(operation.filter ?? {})})`;
};

const buildDemo = (
  id: string,
  action: DemoCase["action"],
  label: string,
  text: string,
  operation: MongoOperation,
  mockResult: DemoCase["mockResult"]
): DemoCase => ({
  id,
  action,
  label,
  text,
  operation,
  mongoShell: formatDemoMongoShell(operation),
  mockResult,
  processTitle: "",
  processSteps: [],
  llmMode: "off"
});

const es: DemoCase[] = [
  buildDemo(
    "find_transactions_food",
    "find",
    "Find · transactions comida",
    "mostrar en transactions donde category = comida",
    { action: "find", collection: "transactions", filter: { category: "comida" }, limit: 50 },
    [{ _id: "sim_demo_find_01", category: "comida", amount: 18, demoTag: "chat-demo", createdAt: "2026-03-07T12:00:00.000Z" }]
  ),
  buildDemo(
    "find_users_active",
    "find",
    "Find · users activos",
    "mostrar en users donde active = true",
    { action: "find", collection: "users", filter: { active: true }, limit: 50 },
    [
      { _id: "sim_demo_find_02", name: "Ana", active: true, role: "analyst", plan: "pro" },
      { _id: "sim_demo_find_03", name: "Marta", active: true, role: "admin", plan: "enterprise" },
      { _id: "sim_demo_find_04", name: "Diego", active: true, role: "engineer", plan: "team" },
      { _id: "sim_demo_find_05", name: "Sofia", active: true, role: "pm", plan: "pro" }
    ]
  ),
  buildDemo(
    "find_products_mouse",
    "find",
    "Find · products precio 39",
    "mostrar en products donde price = 39",
    { action: "find", collection: "products", filter: { price: 39 }, limit: 50 },
    [{ _id: "sim_demo_find_06", sku: "PRD-002", name: "Mouse", price: 39, stock: 120 }]
  ),
  buildDemo(
    "find_audit_generated",
    "find",
    "Find · audit_logs generados",
    "mostrar en audit_logs donde type = query_generated",
    { action: "find", collection: "audit_logs", filter: { type: "query_generated" }, limit: 50 },
    [{ _id: "sim_demo_find_07", type: "query_generated", source: "llm", collection: "transactions", createdAt: "2026-03-09T18:10:00.000Z" }]
  ),
  buildDemo(
    "count_transactions_demo",
    "count",
    "Count · transactions demo",
    'contar en transactions {"demoTag":"chat-demo"}',
    { action: "count", collection: "transactions", filter: { demoTag: "chat-demo" } },
    { total: 3 }
  ),
  buildDemo(
    "count_users_active",
    "count",
    "Count · users activos",
    "contar en users donde active = true",
    { action: "count", collection: "users", filter: { active: true } },
    { total: 4 }
  ),
  buildDemo(
    "count_products_monitor",
    "count",
    "Count · products monitor",
    'contar en products {"sku":"PRD-003"}',
    { action: "count", collection: "products", filter: { sku: "PRD-003" } },
    { total: 1 }
  ),
  buildDemo(
    "count_audit_simulated",
    "count",
    "Count · audit_logs simulated-db",
    'contar en audit_logs {"source":"simulated-db"}',
    { action: "count", collection: "audit_logs", filter: { source: "simulated-db" } },
    { total: 1 }
  ),
  buildDemo(
    "insert_transactions_snack",
    "insertOne",
    "Insert · transactions snack",
    'agrega en transactions {"category":"snack","amount":24,"demoTag":"demo-batch"}',
    { action: "insertOne", collection: "transactions", document: { category: "snack", amount: 24, demoTag: "demo-batch" } },
    { acknowledged: true, insertedId: "sim_demo_insert_01" }
  ),
  buildDemo(
    "insert_transactions_hardware",
    "insertOne",
    "Insert · transactions hardware",
    'agrega en transactions {"category":"hardware","amount":410,"demoTag":"demo-batch"}',
    { action: "insertOne", collection: "transactions", document: { category: "hardware", amount: 410, demoTag: "demo-batch" } },
    { acknowledged: true, insertedId: "sim_demo_insert_02" }
  ),
  buildDemo(
    "insert_users_support",
    "insertOne",
    "Insert · users support",
    'agrega en users {"name":"Carla","active":true,"role":"support","plan":"pro"}',
    { action: "insertOne", collection: "users", document: { name: "Carla", active: true, role: "support", plan: "pro" } },
    { acknowledged: true, insertedId: "sim_demo_insert_03" }
  ),
  buildDemo(
    "insert_audit_products",
    "insertOne",
    "Insert · audit_logs products",
    'agrega en audit_logs {"type":"query_generated","source":"demo-ui","collection":"products","createdAt":"2026-03-10T10:00:00.000Z"}',
    {
      action: "insertOne",
      collection: "audit_logs",
      document: { type: "query_generated", source: "demo-ui", collection: "products", createdAt: "2026-03-10T10:00:00.000Z" }
    },
    { acknowledged: true, insertedId: "sim_demo_insert_04" }
  ),
  buildDemo(
    "update_transactions_reviewed",
    "updateMany",
    "Update · transactions reviewed",
    'actualiza transactions {"demoTag":"chat-demo"} {"$set":{"reviewed":true}}',
    { action: "updateMany", collection: "transactions", filter: { demoTag: "chat-demo" }, update: { $set: { reviewed: true } } },
    { acknowledged: true, matchedCount: 3, modifiedCount: 3 }
  ),
  buildDemo(
    "update_users_viewer",
    "updateMany",
    "Update · users viewer",
    'actualiza users {"role":"viewer"} {"$set":{"active":true}}',
    { action: "updateMany", collection: "users", filter: { role: "viewer" }, update: { $set: { active: true } } },
    { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
  ),
  buildDemo(
    "update_products_stock",
    "updateMany",
    "Update · products stock",
    'actualiza products {"sku":"PRD-002"} {"$set":{"stock":110}}',
    { action: "updateMany", collection: "products", filter: { sku: "PRD-002" }, update: { $set: { stock: 110 } } },
    { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
  ),
  buildDemo(
    "update_audit_type",
    "updateMany",
    "Update · audit_logs type",
    'actualiza audit_logs {"source":"simulated-db"} {"$set":{"type":"query_reviewed"}}',
    { action: "updateMany", collection: "audit_logs", filter: { source: "simulated-db" }, update: { $set: { type: "query_reviewed" } } },
    { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
  ),
  buildDemo(
    "delete_transactions_demo",
    "deleteMany",
    "Delete · transactions demo",
    'elimina en transactions {"demoTag":"chat-demo"}',
    { action: "deleteMany", collection: "transactions", filter: { demoTag: "chat-demo" } },
    { acknowledged: true, deletedCount: 3 }
  ),
  buildDemo(
    "delete_users_inactive",
    "deleteMany",
    "Delete · users inactivos",
    "elimina en users donde active = false",
    { action: "deleteMany", collection: "users", filter: { active: false } },
    { acknowledged: true, deletedCount: 1 }
  ),
  buildDemo(
    "delete_products_monitor",
    "deleteMany",
    "Delete · products monitor",
    'elimina en products {"sku":"PRD-003"}',
    { action: "deleteMany", collection: "products", filter: { sku: "PRD-003" } },
    { acknowledged: true, deletedCount: 1 }
  ),
  buildDemo(
    "delete_audit_simulated",
    "deleteMany",
    "Delete · audit_logs simulated-db",
    'elimina en audit_logs {"source":"simulated-db"}',
    { action: "deleteMany", collection: "audit_logs", filter: { source: "simulated-db" } },
    { acknowledged: true, deletedCount: 1 }
  )
];

const en: DemoCase[] = [
  buildDemo(
    "find_transactions_food",
    "find",
    "Find · transactions food",
    "find in transactions where category = comida",
    { action: "find", collection: "transactions", filter: { category: "comida" }, limit: 50 },
    [{ _id: "sim_demo_find_01", category: "comida", amount: 18, demoTag: "chat-demo", createdAt: "2026-03-07T12:00:00.000Z" }]
  ),
  buildDemo(
    "find_users_active",
    "find",
    "Find · active users",
    "find in users where active = true",
    { action: "find", collection: "users", filter: { active: true }, limit: 50 },
    [
      { _id: "sim_demo_find_02", name: "Ana", active: true, role: "analyst", plan: "pro" },
      { _id: "sim_demo_find_03", name: "Marta", active: true, role: "admin", plan: "enterprise" },
      { _id: "sim_demo_find_04", name: "Diego", active: true, role: "engineer", plan: "team" },
      { _id: "sim_demo_find_05", name: "Sofia", active: true, role: "pm", plan: "pro" }
    ]
  ),
  buildDemo(
    "find_products_mouse",
    "find",
    "Find · products price 39",
    "find in products where price = 39",
    { action: "find", collection: "products", filter: { price: 39 }, limit: 50 },
    [{ _id: "sim_demo_find_06", sku: "PRD-002", name: "Mouse", price: 39, stock: 120 }]
  ),
  buildDemo(
    "find_audit_generated",
    "find",
    "Find · generated audit logs",
    "find in audit_logs where type = query_generated",
    { action: "find", collection: "audit_logs", filter: { type: "query_generated" }, limit: 50 },
    [{ _id: "sim_demo_find_07", type: "query_generated", source: "llm", collection: "transactions", createdAt: "2026-03-09T18:10:00.000Z" }]
  ),
  buildDemo(
    "count_transactions_demo",
    "count",
    "Count · demo transactions",
    'count in transactions {"demoTag":"chat-demo"}',
    { action: "count", collection: "transactions", filter: { demoTag: "chat-demo" } },
    { total: 3 }
  ),
  buildDemo(
    "count_users_active",
    "count",
    "Count · active users",
    "count in users where active = true",
    { action: "count", collection: "users", filter: { active: true } },
    { total: 4 }
  ),
  buildDemo(
    "count_products_monitor",
    "count",
    "Count · product PRD-003",
    'count in products {"sku":"PRD-003"}',
    { action: "count", collection: "products", filter: { sku: "PRD-003" } },
    { total: 1 }
  ),
  buildDemo(
    "count_audit_simulated",
    "count",
    "Count · simulated audit logs",
    'count in audit_logs {"source":"simulated-db"}',
    { action: "count", collection: "audit_logs", filter: { source: "simulated-db" } },
    { total: 1 }
  ),
  buildDemo(
    "insert_transactions_snack",
    "insertOne",
    "Insert · transaction snack",
    'insert in transactions {"category":"snack","amount":24,"demoTag":"demo-batch"}',
    { action: "insertOne", collection: "transactions", document: { category: "snack", amount: 24, demoTag: "demo-batch" } },
    { acknowledged: true, insertedId: "sim_demo_insert_01" }
  ),
  buildDemo(
    "insert_transactions_hardware",
    "insertOne",
    "Insert · transaction hardware",
    'insert in transactions {"category":"hardware","amount":410,"demoTag":"demo-batch"}',
    { action: "insertOne", collection: "transactions", document: { category: "hardware", amount: 410, demoTag: "demo-batch" } },
    { acknowledged: true, insertedId: "sim_demo_insert_02" }
  ),
  buildDemo(
    "insert_users_support",
    "insertOne",
    "Insert · user support",
    'insert in users {"name":"Carla","active":true,"role":"support","plan":"pro"}',
    { action: "insertOne", collection: "users", document: { name: "Carla", active: true, role: "support", plan: "pro" } },
    { acknowledged: true, insertedId: "sim_demo_insert_03" }
  ),
  buildDemo(
    "insert_audit_products",
    "insertOne",
    "Insert · audit log products",
    'insert in audit_logs {"type":"query_generated","source":"demo-ui","collection":"products","createdAt":"2026-03-10T10:00:00.000Z"}',
    {
      action: "insertOne",
      collection: "audit_logs",
      document: { type: "query_generated", source: "demo-ui", collection: "products", createdAt: "2026-03-10T10:00:00.000Z" }
    },
    { acknowledged: true, insertedId: "sim_demo_insert_04" }
  ),
  buildDemo(
    "update_transactions_reviewed",
    "updateMany",
    "Update · transaction review flag",
    'update transactions {"demoTag":"chat-demo"} {"$set":{"reviewed":true}}',
    { action: "updateMany", collection: "transactions", filter: { demoTag: "chat-demo" }, update: { $set: { reviewed: true } } },
    { acknowledged: true, matchedCount: 3, modifiedCount: 3 }
  ),
  buildDemo(
    "update_users_viewer",
    "updateMany",
    "Update · user viewer active",
    'update users {"role":"viewer"} {"$set":{"active":true}}',
    { action: "updateMany", collection: "users", filter: { role: "viewer" }, update: { $set: { active: true } } },
    { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
  ),
  buildDemo(
    "update_products_stock",
    "updateMany",
    "Update · product stock",
    'update products {"sku":"PRD-002"} {"$set":{"stock":110}}',
    { action: "updateMany", collection: "products", filter: { sku: "PRD-002" }, update: { $set: { stock: 110 } } },
    { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
  ),
  buildDemo(
    "update_audit_type",
    "updateMany",
    "Update · audit log type",
    'update audit_logs {"source":"simulated-db"} {"$set":{"type":"query_reviewed"}}',
    { action: "updateMany", collection: "audit_logs", filter: { source: "simulated-db" }, update: { $set: { type: "query_reviewed" } } },
    { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
  ),
  buildDemo(
    "delete_transactions_demo",
    "deleteMany",
    "Delete · demo transactions",
    'delete in transactions {"demoTag":"chat-demo"}',
    { action: "deleteMany", collection: "transactions", filter: { demoTag: "chat-demo" } },
    { acknowledged: true, deletedCount: 3 }
  ),
  buildDemo(
    "delete_users_inactive",
    "deleteMany",
    "Delete · inactive users",
    "delete in users where active = false",
    { action: "deleteMany", collection: "users", filter: { active: false } },
    { acknowledged: true, deletedCount: 1 }
  ),
  buildDemo(
    "delete_products_monitor",
    "deleteMany",
    "Delete · product PRD-003",
    'delete in products {"sku":"PRD-003"}',
    { action: "deleteMany", collection: "products", filter: { sku: "PRD-003" } },
    { acknowledged: true, deletedCount: 1 }
  ),
  buildDemo(
    "delete_audit_simulated",
    "deleteMany",
    "Delete · simulated audit logs",
    'delete in audit_logs {"source":"simulated-db"}',
    { action: "deleteMany", collection: "audit_logs", filter: { source: "simulated-db" } },
    { acknowledged: true, deletedCount: 1 }
  )
];

export const demosByLanguage: Record<Language, DemoCase[]> = {
  es,
  en
};
