import { strictFilterSchema } from "./strictFilterSchema";

describe("strictFilterSchema", () => {
  test("normalizes date from/to to $gte/$lte", () => {
    const result = strictFilterSchema({
      filter: {
        date: {
          from: "2026-03-01T00:00:00.000Z",
          to: "2026-03-01T23:59:59.999Z"
        }
      }
    });

    expect(result.filter.date).toEqual({
      $gte: "2026-03-01T00:00:00.000Z",
      $lte: "2026-03-01T23:59:59.999Z"
    });
  });
});

