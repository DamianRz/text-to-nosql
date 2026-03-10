import type { FlowIconName } from "./chatMongo.types";

export const iconPathMap: Record<FlowIconName, string> = {
  input:
    "M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v9A2.5 2.5 0 0 1 17.5 18h-6l-3.5 2v-2H6.5A2.5 2.5 0 0 1 4 15.5z",
  intent: "M5 5h14v4H5zm0 5h8v4H5zm0 5h14v4H5z",
  llm: "M12 3 4 7v5c0 4.4 3 8.4 8 9 5-0.6 8-4.6 8-9V7l-8-4zm0 5 2 2-2 2-2-2 2-2z",
  query: "M5 4h14v3H5zm0 5h14v3H5zm0 5h9v3H5z",
  mongo: "M12 3c-3.8 2.2-6 5.6-6 9.2 0 3.8 2.4 6.6 6 8.8 3.6-2.2 6-5 6-8.8 0-3.6-2.2-7-6-9.2z",
  result: "M5 12.5 9.5 17 19 7.5l-1.8-1.8-7.7 7.7-2.7-2.7z"
};
