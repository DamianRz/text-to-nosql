import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { ChatMongo } from "./ChatMongo";
import { appTheme } from "@/styles/theme";

const mockedFetch = jest.fn();
const localModelsResponse = {
  ok: true,
  models: ["llama3.1:8b", "mistral:7b"],
  currentModel: "llama3.1:8b"
};
type MockFetchResponse = { json: () => Promise<unknown> };

const renderChatMongo = () =>
  render(
    <ThemeProvider theme={appTheme}>
      <ChatMongo />
    </ThemeProvider>
  );

const waitForLocalModelSelect = async () => {
  await waitFor(() => {
    expect(screen.getByLabelText("local-model-select")).toBeEnabled();
  });
};

describe("ChatMongo", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    global.fetch = mockedFetch;
    window.sessionStorage.clear();
  });

  test("generates a query and executes it in two explicit steps", async () => {
    mockedFetch
      .mockResolvedValueOnce({
        json: async () => localModelsResponse
      })
      .mockResolvedValueOnce({
        json: async () => ({
          ok: true,
          operation: {
            action: "count",
            collection: "transactions",
            filter: { category: "comida" }
          },
          mongoShell: 'db.transactions.countDocuments({"category":"comida"})'
        })
      });

    renderChatMongo();
    const user = userEvent.setup();
    await waitForLocalModelSelect();
    await user.type(screen.getByLabelText("chat-input"), "contar en transactions donde category = comida");
    await user.click(screen.getByRole("button", { name: "Generar consulta" }));

    await waitFor(() => {
      expect(screen.getByLabelText("generated-query")).toHaveTextContent("countDocuments");
      expect(screen.getByText(/Consulta lista para ejecutar/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Ejecutar consulta" }));

    await waitFor(() => {
      expect(screen.getByLabelText("execution-result")).toHaveTextContent('"total": 1');
    });

    expect(mockedFetch).toHaveBeenCalledTimes(2);
  }, 15000);

  test("loads and runs a selected demo from the sidebar", async () => {
    mockedFetch
      .mockResolvedValueOnce({
        json: async () => localModelsResponse
      })
      .mockResolvedValueOnce({
        json: async () => ({
          ok: true,
          operation: {
            action: "deleteMany",
            collection: "users",
            filter: { active: false }
          },
          mongoShell: 'db.users.deleteMany({"active":false})'
        })
      });

    renderChatMongo();
    const user = userEvent.setup();
    await waitForLocalModelSelect();
    await user.click(screen.getByRole("button", { name: /Delete · users inactivos/i }));
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Ejecutar demo" }));
    });

    await waitFor(() => {
      expect(screen.getByLabelText("generated-query")).toHaveTextContent("deleteMany");
      expect(screen.getByLabelText("execution-result")).toHaveTextContent('"deletedCount": 1');
    });

    expect(mockedFetch).toHaveBeenCalledTimes(2);
  });

  test("runs LLM demo in force mode", async () => {
    mockedFetch
      .mockResolvedValueOnce({
        json: async () => localModelsResponse
      })
      .mockResolvedValueOnce({
        json: async () => ({
          ok: true,
          operation: {
            action: "find",
            collection: "audit_logs",
            filter: { type: "query_generated" },
            limit: 10
          },
          mongoShell: 'db.audit_logs.find({"type":"query_generated"}).limit(10)'
        })
      });

    renderChatMongo();
    const user = userEvent.setup();
    await waitForLocalModelSelect();
    await user.click(screen.getByRole("button", { name: /Find · audit_logs generados/i }));
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Ejecutar demo" }));
    });

    await waitFor(() => {
      expect(screen.getByLabelText("generated-query")).toHaveTextContent("audit_logs");
      expect(screen.getByText(/Resolver deterministico/i)).toBeInTheDocument();
    });

    const firstChatCall = mockedFetch.mock.calls[1];
    const requestBody = JSON.parse(String(firstChatCall[1]?.body ?? "{}")) as { llmMode?: string };
    expect(requestBody.llmMode).toBe("off");
  });

  test("allows switching language to English", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();

    const user = userEvent.setup();
    await waitForLocalModelSelect();
    await user.selectOptions(screen.getByLabelText("language-select"), "en");

    expect(screen.getByText("1. Describe what you want to do")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate query" })).toBeInTheDocument();
  });

  test("renders the professional dashboard layout without presentation breadcrumbs", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    await waitForLocalModelSelect();

    expect(screen.getByText("Ejemplos guiados")).toBeInTheDocument();
    expect(screen.getByLabelText("local-database-viewer")).toBeInTheDocument();
    expect(screen.queryByLabelText("presentation-breadcrumbs")).not.toBeInTheDocument();
  });

  test("shows a hosted local-run notice and mock example panels", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    const user = userEvent.setup();
    await waitForLocalModelSelect();
    await user.click(screen.getByRole("button", { name: "Hosted" }));

    expect(screen.getAllByText(/ejecuta el proyecto localmente/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/README/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText("generated-query")).toHaveTextContent("db.transactions.find");

    await user.click(screen.getByRole("button", { name: /Delete · users inactivos/i }));

    expect(screen.getByLabelText("generated-query")).toHaveTextContent("db.users.deleteMany");
    expect(screen.getByLabelText("execution-result")).toHaveTextContent('"deletedCount": 1');
  });

  test("disables query generation while a request is in flight", async () => {
    let resolveChatRequest: ((value: MockFetchResponse) => void) | undefined;
    mockedFetch
      .mockResolvedValueOnce({
        json: async () => localModelsResponse
      })
      .mockImplementationOnce(
        () =>
          new Promise<MockFetchResponse>((resolve) => {
            resolveChatRequest = resolve;
          })
      );

    renderChatMongo();

    const user = userEvent.setup();
    await waitForLocalModelSelect();
    await user.clear(screen.getByLabelText("chat-input"));
    await user.type(screen.getByLabelText("chat-input"), "mostrar transactions");
    await user.click(screen.getByRole("button", { name: "Generar consulta" }));

    expect(screen.getByRole("button", { name: "Generando consulta..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Ejecutar consulta" })).toBeDisabled();

    if (!resolveChatRequest) {
      throw new Error("Chat request resolver was not initialized.");
    }

    resolveChatRequest({
      json: async () => ({
        ok: true,
        operation: {
          action: "find",
          collection: "transactions",
          filter: {}
        },
        mongoShell: "db.transactions.find({})"
      })
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Generar consulta" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "Ejecutar consulta" })).toBeEnabled();
    }, { timeout: 10000 });
  }, 15000);

  test("loads a selected demo into the editor", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();

    const user = userEvent.setup();
    await waitForLocalModelSelect();
    await user.click(screen.getByRole("button", { name: /Insert · users support/i }));

    expect(screen.getByLabelText("chat-input")).toHaveValue('agrega en users {"name":"Carla","active":true,"role":"support","plan":"pro"}');
  });

  test("shows parser errors in the logs and alert area", async () => {
    mockedFetch
      .mockResolvedValueOnce({
        json: async () => localModelsResponse
      })
      .mockResolvedValueOnce({
        json: async () => ({
          ok: false,
          errors: ["No se detecto una coleccion valida."]
        })
      });

    renderChatMongo();

    const user = userEvent.setup();
    await waitForLocalModelSelect();
    await user.type(screen.getByLabelText("chat-input"), "haz algo");
    await user.click(screen.getByRole("button", { name: "Generar consulta" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("No se detecto una coleccion valida.");
      expect(screen.getByLabelText("activity-logs")).toHaveTextContent("No se detecto una coleccion valida.");
    });
  });

  test("loads available local models", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    await waitForLocalModelSelect();

    expect(screen.getByLabelText("local-model-select")).toHaveValue("llama3.1:8b");
    expect(screen.getAllByText(/Base simulada en sesion/i).length).toBeGreaterThan(0);
  });

  test("shows the simulated database collections and documents", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();

    const user = userEvent.setup();
    await waitForLocalModelSelect();

    const viewer = within(screen.getByLabelText("local-database-viewer"));
    expect(viewer.getByRole("button", { name: /transactions/i })).toBeInTheDocument();
    expect(viewer.getByRole("button", { name: /products/i })).toBeInTheDocument();

    await user.click(viewer.getByRole("button", { name: /products/i }));

    expect(screen.getByText(/Notebook/)).toBeInTheDocument();
    expect(screen.getByText(/PRD-001/)).toBeInTheDocument();
  });
});
