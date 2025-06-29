import { createBudgetEntry, parseBudgetInput } from "../budget";

// Helper for date tolerance
function datesAreClose(date1: Date, date2: Date, toleranceMs = 1000) {
  return Math.abs(date1.getTime() - date2.getTime()) < toleranceMs;
}

describe("parseBudgetInput", () => {
  test("should parse valid budget input", async () => {
    const input = ["100.00", "Groceries", "Food", "Weekly grocery shopping"];
    const result = await parseBudgetInput(input);
    expect(result).not.toBeNull();
    if (result) {
      const today = new Date();
      const resultDate = new Date(result.Date);
      expect(datesAreClose(resultDate, today)).toBe(true);
      expect(result).toMatchObject({
        Alt: "expense",
        Name: "Food",
        Amount: -100,
        Category: "Groceries",
        Type: "Expense",
        Notes: "Weekly grocery shopping",
      });
    }
  });

  test("should return null for invalid input", async () => {
    const input = ["Invalid", "Input"];
    const result = await parseBudgetInput(input);
    expect(result).toBeNull();
  });
});
