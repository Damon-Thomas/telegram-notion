import {
  normalizeFrequency,
  parseDateShortcut,
  parseTaskInput,
} from "../textParser";

describe("parseDateShortcut", () => {
  test("parseDateShortcut should parse date shortcuts correctly", () => {
    const testCases = [
      { input: "today", expected: new Date().toISOString().split("T")[0] }, // Today's date
      { input: "8Apr", expected: "2025-04-08" },
      { input: "Apr8", expected: "2025-04-08" },
      { input: "1Jan", expected: "2025-01-01" },
      { input: "Jan1", expected: "2025-01-01" },
      { input: "invalid", expected: new Date().toISOString().split("T")[0] }, // Fallback to today for invalid input
    ];
    testCases.forEach(({ input, expected }) => {
      const result = parseDateShortcut(input);
      expect(result).toBe(expected);
    });
  });
});

describe("parseTaskInput", () => {
  test("parseTaskInput should parse task input correctly", () => {
    const input = [
      "Task Name",
      "- This is a note",
      "chore",
      "h",
      "d 2023-10-01",
      "f daily",
    ];

    const expectedOutput = {
      Name: "Task Name",
      Tag: "chore",
      Priority: "High",
      Date: new Date().toISOString().split("T")[0], // Assuming today's date for the test
      Frequency: "daily",
      Notes: "This is a note",
    };

    const result = parseTaskInput(input);

    expect(result).toEqual(expectedOutput);
  });
});

describe("normalizeFrequency", () => {
  test("normalizeFrequency should normalize frequency strings", () => {
    const testCases = [
      { input: "daily", expected: "daily" },
      { input: "weekly", expected: "weekly" },
      { input: "monthly", expected: "monthly" },
      { input: "quarterly", expected: "quarterly" },
      { input: "annually", expected: "annually" },
      { input: "none", expected: "none" },
      { input: "8", expected: "8 days" },
      { input: "20", expected: "20 days" },
    ];

    testCases.forEach(({ input, expected }) => {
      const result = normalizeFrequency(input);
      console.log(`Input: ${input}, Normalized: ${result}`);
      expect(result).toBe(expected);
    });
  });
});
