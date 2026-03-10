const seededCollections = {
  transactions: [
    { _id: "txn_001", category: "food", amount: 18, demoTag: "chat-demo", createdAt: "2026-03-07T12:00:00.000Z" },
    { _id: "txn_002", category: "transport", amount: 32, demoTag: "chat-demo", createdAt: "2026-03-07T14:30:00.000Z" },
    { _id: "txn_003", category: "hardware", amount: 410, demoTag: "demo-batch", createdAt: "2026-03-08T10:12:00.000Z" },
    { _id: "txn_004", category: "food", amount: 24, demoTag: "chat-demo", createdAt: "2026-03-09T08:22:00.000Z" }
  ],
  users: [
    { _id: "usr_001", name: "Ana", active: true, role: "analyst", plan: "pro" },
    { _id: "usr_002", name: "Marta", active: true, role: "admin", plan: "enterprise" },
    { _id: "usr_003", name: "Diego", active: true, role: "engineer", plan: "team" },
    { _id: "usr_004", name: "Carla", active: true, role: "support", plan: "pro" },
    { _id: "usr_005", name: "Ivan", active: false, role: "viewer", plan: "starter" }
  ],
  products: [
    { _id: "prd_001", sku: "PRD-001", name: "Notebook", price: 1250, stock: 14 },
    { _id: "prd_002", sku: "PRD-002", name: "Mouse", price: 39, stock: 120 },
    { _id: "prd_003", sku: "PRD-003", name: "Monitor", price: 420, stock: 20 }
  ],
  audit_logs: [
    { _id: "log_001", type: "query_generated", source: "llm", collection: "transactions", createdAt: "2026-03-09T18:10:00.000Z" },
    { _id: "log_002", type: "query_reviewed", source: "simulated-db", collection: "users", createdAt: "2026-03-10T09:15:00.000Z" }
  ]
};

const demos = [
  {
    id: "find_transactions_food",
    label: "Find · transactions food",
    action: "find",
    collection: "transactions",
    input: 'Find transactions where category equals "food"',
    query: 'db.transactions.find({ "category": "food" }).limit(50)',
    result: [
      { _id: "txn_001", category: "food", amount: 18, demoTag: "chat-demo" },
      { _id: "txn_004", category: "food", amount: 24, demoTag: "chat-demo" }
    ]
  },
  {
    id: "find_users_active",
    label: "Find · active users",
    action: "find",
    collection: "users",
    input: "Find users where active = true",
    query: "db.users.find({ \"active\": true }).limit(50)",
    result: [
      { _id: "usr_001", name: "Ana", active: true, role: "analyst" },
      { _id: "usr_002", name: "Marta", active: true, role: "admin" }
    ]
  },
  {
    id: "find_products_mouse",
    label: "Find · products price 39",
    action: "find",
    collection: "products",
    input: "Find products where price = 39",
    query: "db.products.find({ \"price\": 39 }).limit(50)",
    result: [{ _id: "prd_002", sku: "PRD-002", name: "Mouse", price: 39, stock: 120 }]
  },
  {
    id: "count_demo_transactions",
    label: "Count · demo transactions",
    action: "count",
    collection: "transactions",
    input: 'Count transactions with demoTag = "chat-demo"',
    query: 'db.transactions.countDocuments({ "demoTag": "chat-demo" })',
    result: { total: 3 }
  },
  {
    id: "count_active_users",
    label: "Count · active users",
    action: "count",
    collection: "users",
    input: "Count users where active = true",
    query: 'db.users.countDocuments({ "active": true })',
    result: { total: 4 }
  },
  {
    id: "insert_transaction",
    label: "Insert · transaction snack",
    action: "insertOne",
    collection: "transactions",
    input: 'Insert into transactions { "category": "snack", "amount": 24, "demoTag": "demo-batch" }',
    query: 'db.transactions.insertOne({ "category": "snack", "amount": 24, "demoTag": "demo-batch" })',
    result: { acknowledged: true, insertedId: "sim_demo_insert_01" }
  },
  {
    id: "insert_user",
    label: "Insert · user support",
    action: "insertOne",
    collection: "users",
    input: 'Insert into users { "name": "Carla", "active": true, "role": "support", "plan": "pro" }',
    query: 'db.users.insertOne({ "name": "Carla", "active": true, "role": "support", "plan": "pro" })',
    result: { acknowledged: true, insertedId: "sim_demo_insert_03" }
  },
  {
    id: "update_users_viewer",
    label: "Update · user viewer active",
    action: "updateMany",
    collection: "users",
    input: 'Update users where role = "viewer" with { "$set": { "active": true } }',
    query: 'db.users.updateMany({ "role": "viewer" }, { "$set": { "active": true } })',
    result: { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
  },
  {
    id: "update_products_stock",
    label: "Update · product stock",
    action: "updateMany",
    collection: "products",
    input: 'Update products where sku = "PRD-002" with { "$set": { "stock": 110 } }',
    query: 'db.products.updateMany({ "sku": "PRD-002" }, { "$set": { "stock": 110 } })',
    result: { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
  },
  {
    id: "delete_users_inactive",
    label: "Delete · inactive users",
    action: "deleteMany",
    collection: "users",
    input: "Delete users where active = false",
    query: 'db.users.deleteMany({ "active": false })',
    result: { acknowledged: true, deletedCount: 1 }
  }
];

const navElement = document.getElementById("demo-nav");
const collectionListElement = document.getElementById("collection-list");
const documentListElement = document.getElementById("document-list");
const inputElement = document.getElementById("demo-input");
const actionElement = document.getElementById("demo-action");
const queryElement = document.getElementById("demo-query");
const resultElement = document.getElementById("demo-result");
const logsElement = document.getElementById("demo-logs");

let selectedDemoId = demos[0].id;
let selectedCollection = demos[0].collection;

const stringify = (value) => JSON.stringify(value, null, 2);

const getSelectedDemo = () => demos.find((demo) => demo.id === selectedDemoId) ?? demos[0];

const renderLogs = (demo) => {
  const entries = [
    { role: "user", text: demo.input },
    { role: "system", text: `Query ready to review\n${demo.query}` },
    { role: "system", text: stringify(demo.result) }
  ];

  logsElement.innerHTML = entries
    .map(
      (entry) => `
        <div class="log-entry">
          <div class="log-role">${entry.role}</div>
          <div>${entry.text.replace(/\n/g, "<br>")}</div>
        </div>
      `
    )
    .join("");
};

const renderCollections = () => {
  collectionListElement.className = "collections-list";
  collectionListElement.innerHTML = Object.entries(seededCollections)
    .map(
      ([name, documents]) => `
        <button class="collection-button ${name === selectedCollection ? "is-active" : ""}" type="button" data-collection="${name}">
          <span class="demo-name">${name}</span>
          <span class="collection-meta">${documents.length} documents</span>
        </button>
      `
    )
    .join("");

  collectionListElement.querySelectorAll("[data-collection]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedCollection = button.getAttribute("data-collection") || selectedCollection;
      renderCollections();
      renderDocuments();
    });
  });
};

const renderDocuments = () => {
  const documents = seededCollections[selectedCollection] || [];
  documentListElement.innerHTML = documents
    .map((document) => `<pre class="document-card">${stringify(document)}</pre>`)
    .join("");
};

const renderDemoNav = () => {
  navElement.innerHTML = demos
    .map(
      (demo) => `
        <button class="demo-button ${demo.id === selectedDemoId ? "is-active" : ""}" type="button" data-demo="${demo.id}">
          <span class="demo-name">${demo.label}</span>
          <span class="demo-meta">${demo.collection} · ${demo.action}</span>
        </button>
      `
    )
    .join("");

  navElement.querySelectorAll("[data-demo]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDemoId = button.getAttribute("data-demo") || selectedDemoId;
      render();
    });
  });
};

const render = () => {
  const demo = getSelectedDemo();
  selectedCollection = demo.collection;

  inputElement.textContent = demo.input;
  actionElement.textContent = `${demo.action} · ${demo.collection}`;
  queryElement.textContent = demo.query;
  resultElement.textContent = stringify(demo.result);

  renderDemoNav();
  renderLogs(demo);
  renderCollections();
  renderDocuments();
};

render();
