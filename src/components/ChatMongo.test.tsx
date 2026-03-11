import { render, screen, waitFor } from "@testing-library/react";
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

const renderChatMongo = () =>
  render(
    <ThemeProvider theme={appTheme}>
      <ChatMongo />
    </ThemeProvider>
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

  test("renders a minimal utility layout first", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    await waitForInitialLoad();

    expect(screen.getByText("Text to NoSQL")).toBeInTheDocument();
    expect(screen.getByText("Natural Language → MongoDB Query Generator")).toBeInTheDocument();
    expect(screen.getByLabelText("chat-input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate query" })).toBeInTheDocument();
    expect(screen.getByText("Advanced options")).toBeInTheDocument();
    expect(screen.getByText("About this project")).toBeInTheDocument();
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

    await user.type(screen.getByLabelText("chat-input"), "contar en transactions donde category = comida");
    await user.click(screen.getByRole("button", { name: "Generate query" }));

    await waitFor(() => {
      expect(screen.getByLabelText("generated-query")).toHaveTextContent("countDocuments");
    });

    await user.click(screen.getByRole("button", { name: "Run query" }));

    await waitFor(() => {
      expect(screen.getByLabelText("execution-result")).toHaveTextContent('"total": 1');
    });

    expect(mockedFetch).toHaveBeenCalledTimes(2);
  }, 15000);

  test("allows switching language inside advanced options", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    const user = userEvent.setup();
    await waitForInitialLoad();
    await user.click(screen.getByText("Advanced options"));
    await user.selectOptions(screen.getByLabelText("language-select"), "es");

    expect(screen.getByText("Inicio rapido")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generar consulta" })).toBeInTheDocument();
  });

  test("loads a demo into the editor from advanced options", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    const user = userEvent.setup();
    await waitForInitialLoad();
    await user.click(screen.getByText("Advanced options"));
    await user.click(screen.getAllByRole("button", { name: "Load into editor" })[0]);

    expect(screen.getByLabelText("chat-input")).not.toHaveValue("");
  });

  test("runs a demo from advanced options", async () => {
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
    await waitForInitialLoad();
    await user.click(screen.getByText("Advanced options"));
    await user.click(screen.getAllByRole("button", { name: "Run demo" })[0]);

    await waitFor(() => {
      expect(screen.getByLabelText("generated-query")).toHaveTextContent("db.");
      expect(screen.getByLabelText("execution-result")).not.toHaveTextContent("No results yet.");
    });
  }, 15000);

  test("shows hosted notice when preview mode changes", async () => {
    mockedFetch.mockResolvedValueOnce({
      json: async () => localModelsResponse
    });

    renderChatMongo();
    const user = userEvent.setup();
    await waitForInitialLoad();
    await user.click(screen.getByText("Advanced options"));
    await user.selectOptions(screen.getByLabelText("preview-mode-select"), "hosted");

    expect(screen.getByText(/run the project locally/i)).toBeInTheDocument();
  });
});
