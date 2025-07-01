import * as telegramModule from "../utils/telegramMessage";
import { createBudgetEntry, parseBudgetInput } from "../budget";
import * as createNotionPage from "../data/budget/createNotionPage";

jest.spyOn(createNotionPage, "default").mockResolvedValue({
  success: true,
  message: "Notion page created successfully",
});

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

  test("should parse valid short budget input ", async () => {
    const input = ["100.00", "Groceries", "Food"];
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
        Notes: "",
      });
    }
  });

  test("should parse valid for income ", async () => {
    const input = [
      "+500.00",
      "Freelance",
      "Work",
      "Payment for freelance work",
    ];
    const result = await parseBudgetInput(input);
    expect(result).not.toBeNull();
    if (result) {
      const today = new Date();
      const resultDate = new Date(result.Date);
      expect(datesAreClose(resultDate, today)).toBe(true);
      expect(result).toMatchObject({
        Alt: "income",
        Name: "Work",
        Amount: 500,
        Category: "Freelance",
        Type: "Income",
        Notes: "Payment for freelance work",
      });
    }
  });

  test("should return null for invalid input", async () => {
    const input = ["Invalid", "Input"];
    const result = await parseBudgetInput(input);
    expect(result).toBeNull();
  });
});

describe("createBudgetEntry", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("should create a budget entry", async () => {
    const input = ["100.00", "Groceries", "Food", "Weekly grocery shopping"];
    const result = await createBudgetEntry(input);
    expect(result).toEqual({
      success: true,
      message: "Budget entry created successfully!",
    });
  });

  test("should handle valid input with no notes", async () => {
    jest
      .spyOn(telegramModule, "sendTelegramMessage")
      .mockResolvedValue(undefined);
    const input = ["100.00", "Groceries", "Food"];
    const result = await createBudgetEntry(input);
    expect(result).toEqual({
      success: true,
      message: "Budget entry created successfully!",
    });
  });

  test("should hendle telegram message sending error", async () => {
    jest
      .spyOn(telegramModule, "sendTelegramMessage")
      .mockRejectedValue(new Error("Telegram API error"));
    const input = ["100.00", "Groceries", "Food", "Weekly grocery shopping"];
    const result = await createBudgetEntry(input);
    expect(result).toEqual({
      success: false,
      message: "Error creating budget entry: Telegram API error",
    });
  });

  test("should handle error when creating budget entry", async () => {
    jest
      .spyOn(createNotionPage, "default")
      .mockRejectedValue(new Error("Notion API error"));
    const input = ["100.00", "Groceries", "Food", "Weekly grocery shopping"];
    const result = await createBudgetEntry(input);
    expect(result).toEqual({
      success: false,
      message: "Error creating budget entry: Notion API error",
    });
  });

  test("should handle error when Notion page creation fails", async () => {
    jest.spyOn(createNotionPage, "default").mockResolvedValue(undefined);
    const input = ["100.00", "Groceries", "Food", "Weekly grocery shopping"];
    const result = await createBudgetEntry(input);
    expect(result).toEqual({
      success: false,
      message: "Error creating budget entry: Telegram API error",
    });
  });

  test("should handle unknown errors gracefully", async () => {
    jest.spyOn(createNotionPage, "default").mockImplementation(() => {
      throw new Error("Unknown error");
    });
    const input = ["100.00", "Groceries", "Food", "Weekly grocery shopping"];
    const result = await createBudgetEntry(input);
    expect(result).toEqual({
      success: false,
      message: "Error creating budget entry: Unknown error",
    });
  });

  test("should handle empty input", async () => {
    const input: string[] = [];
    const result = await createBudgetEntry(input);
    expect(result).toEqual({
      success: false,
      message: "Failed to parse budget input. Please check the format.",
    });
  });

  test("should handle input with missing fields", async () => {
    const input = ["100.00", "Groceries"]; // Missing Type and Notes
    const result = await createBudgetEntry(input);
    expect(result).toEqual({
      success: false,
      message: "Failed to parse budget input. Please check the format.",
    });
  });
});
