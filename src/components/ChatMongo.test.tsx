import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppThemeProvider } from "./AppThemeProvider";
import { ChatMongo } from "./ChatMongo";

const mockedFetch = jest.fn();
const localModelsResponse = {
  ok: true,
  models: ["llama3.1:8b", "mistral:7b"],
  currentModel: "llama3.1:8b"
};

const renderChatMongo = () =>
  render(
    <AppThemeProvider>
      <ChatMongo />
    </AppThemeProvider>
  );

const waitForInitialLoad = async () => {
  await waitFor(() => {
    expect(mockedFetch).toHaveBeenCalled();
  });
};

describe("ChatMongo", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    global.fetch = mockedFetch;
    window.sessionStorage.clear();
  });

  test("renders a compact tool-first layout", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    await waitForInitialLoad();

    expect(screen.getByText("Text to NoSQL")).toBeInTheDocument();
    expect(screen.getByText("Natural Language → MongoDB Query Generator")).toBeInTheDocument();
    expect(screen.getByLabelText("chat-input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate query" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run query" })).toBeInTheDocument();
    expect(screen.getByText("Local simulated database")).toBeInTheDocument();
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
    await waitForInitialLoad();

    await user.type(screen.getByRole("textbox", { name: "1. Describe what you want to do" }), "contar en transactions donde category = comida");
    await user.click(screen.getByRole("button", { name: "Generate query" }));

    await waitFor(() => {
      expect(screen.getByText("count · transactions")).toBeInTheDocument();
      expect(screen.getAllByText(/countDocuments/).length).toBeGreaterThan(0);
    });

    await user.click(screen.getByRole("button", { name: "Run query" }));

    await waitFor(() => {
      expect(screen.getAllByText(/"total": 1/).length).toBeGreaterThan(0);
    });

    expect(mockedFetch).toHaveBeenCalledTimes(2);
  }, 15000);

  test("allows switching language from the header controls", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    const user = userEvent.setup();
    await waitForInitialLoad();
    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Language" }));
    await user.click(screen.getByRole("option", { name: "Spanish" }));

    expect(screen.getByText("Inicio rapido")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generar consulta" })).toBeInTheDocument();
  });

  test("switches to hosted preview and renders demo-first content", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    const user = userEvent.setup();
    await waitForInitialLoad();

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "View" }));
    await user.click(screen.getByRole("option", { name: "Hosted" }));

    expect(screen.getByText("Hosted preview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Run demo" })).toBeInTheDocument();
  });

  test("renders hosted demos without calling chat endpoints", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    const user = userEvent.setup();
    await waitForInitialLoad();

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "View" }));
    await user.click(screen.getByRole("option", { name: "Hosted" }));
    await user.click(screen.getByRole("button", { name: "Run demo" }));

    expect(screen.getByText(/db\./)).toBeInTheDocument();
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });
});
