import { parseAndRoute } from "../parseAndRoute";
import * as budgetModule from "../budget";
import * as tasksModule from "../tasks";
import * as mealsModule from "../meals";
import * as helpModule from "../help/help";
import * as telegramModule from "../utils/telegramMessage";

// Mock all dependencies
jest.mock("../budget");
jest.mock("../tasks");
jest.mock("../meals");
jest.mock("../help/help");
jest.mock("../utils/telegramMessage");

const mockCreateBudgetEntry =
  budgetModule.createBudgetEntry as jest.MockedFunction<
    typeof budgetModule.createBudgetEntry
  >;
const mockCreateTaskEntry = tasksModule.createTaskEntry as jest.MockedFunction<
  typeof tasksModule.createTaskEntry
>;
const mockCreateMealEntry = mealsModule.createMealEntry as jest.MockedFunction<
  typeof mealsModule.createMealEntry
>;
const mockSendHelpMessage = helpModule.sendHelpMessage as jest.MockedFunction<
  typeof helpModule.sendHelpMessage
>;
const mockSendTelegramMessage =
  telegramModule.sendTelegramMessage as jest.MockedFunction<
    typeof telegramModule.sendTelegramMessage
  >;

describe("parseAndRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Budget routing (flag: 'b')", () => {
    test("should route to createBudgetEntry with correct parameters", async () => {
      // Arrange
      const message = "b, 100.50, Groceries, Food, Weekly shopping";
      const expectedParams = ["100.50", "Groceries", "Food", "Weekly shopping"];
      const mockReturn = { success: true, message: "Budget created" };
      mockCreateBudgetEntry.mockResolvedValue(mockReturn);

      // Act
      const result = await parseAndRoute(message);

      // Assert
      expect(mockCreateBudgetEntry).toHaveBeenCalledWith(expectedParams);
      expect(result).toBe(mockReturn);
    });

    test("should handle budget entry with spaces in parameters", async () => {
      // Arrange
      const message =
        "b,  50.00 , Restaurant Bill , Dining , Lunch with colleagues  ";
      const expectedParams = [
        "50.00",
        "Restaurant Bill",
        "Dining",
        "Lunch with colleagues",
      ];
      mockCreateBudgetEntry.mockResolvedValue({
        success: true,
        message: "Success",
      });

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockCreateBudgetEntry).toHaveBeenCalledWith(expectedParams);
    });

    test("should handle uppercase 'B' flag", async () => {
      // Arrange
      const message = "B, 25.99, Coffee, Beverages";
      const expectedParams = ["25.99", "Coffee", "Beverages"];
      mockCreateBudgetEntry.mockResolvedValue({
        success: true,
        message: "Success",
      });

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockCreateBudgetEntry).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe("Task routing (flag: 't')", () => {
    test("should route to createTaskEntry with correct parameters", async () => {
      // Arrange
      const message = "t, Buy groceries, chore, h, d Apr15";
      const expectedParams = ["Buy groceries", "chore", "h", "d Apr15"];
      const mockReturn = { success: true, message: "Task created" };
      mockCreateTaskEntry.mockResolvedValue(mockReturn);

      // Act
      const result = await parseAndRoute(message);

      // Assert
      expect(mockCreateTaskEntry).toHaveBeenCalledWith(expectedParams);
      expect(result).toBe(mockReturn);
    });

    test("should handle task with minimal parameters", async () => {
      // Arrange
      const message = "t, Simple task";
      const expectedParams = ["Simple task"];
      mockCreateTaskEntry.mockResolvedValue({
        success: true,
        message: "Success",
      });

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockCreateTaskEntry).toHaveBeenCalledWith(expectedParams);
    });

    test("should handle uppercase 'T' flag", async () => {
      // Arrange
      const message = "T, Clean house, chore";
      const expectedParams = ["Clean house", "chore"];
      mockCreateTaskEntry.mockResolvedValue({
        success: true,
        message: "Success",
      });

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockCreateTaskEntry).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe("Meal routing (flag: 'm')", () => {
    test("should route to createMealEntry with correct parameters", async () => {
      // Arrange
      const message = "m, Breakfast, Oatmeal, Healthy start";
      const expectedParams = ["Breakfast", "Oatmeal", "Healthy start"];
      mockCreateMealEntry.mockResolvedValue(undefined);

      // Act
      const result = await parseAndRoute(message);

      // Assert
      expect(mockCreateMealEntry).toHaveBeenCalledWith(expectedParams);
      expect(result).toBeUndefined();
    });

    test("should handle uppercase 'M' flag", async () => {
      // Arrange
      const message = "M, Lunch, Salad";
      const expectedParams = ["Lunch", "Salad"];
      mockCreateMealEntry.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockCreateMealEntry).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe("Help routing (flag: 'h' or 'help')", () => {
    test("should route to sendHelpMessage with 'h' flag and specific help type", async () => {
      // Arrange
      const message = "h, budget";
      mockSendHelpMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendHelpMessage).toHaveBeenCalledWith("budget");
    });

    test("should route to sendHelpMessage with 'help' flag", async () => {
      // Arrange
      const message = "help, task";
      mockSendHelpMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendHelpMessage).toHaveBeenCalledWith("task");
    });

    test("should handle help with no specific type", async () => {
      // Arrange
      const message = "h";
      mockSendHelpMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendHelpMessage).toHaveBeenCalledWith(undefined);
    });

    test("should handle uppercase 'HELP' flag", async () => {
      // Arrange
      const message = "HELP, diet";
      mockSendHelpMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendHelpMessage).toHaveBeenCalledWith("diet");
    });

    test("should handle help with empty parameters array", async () => {
      // Arrange
      const message = "h,";
      mockSendHelpMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendHelpMessage).toHaveBeenCalledWith("");
    });
  });

  describe("Unknown command handling", () => {
    test("should send unknown command message for unrecognized flag", async () => {
      // Arrange
      const message = "x, some, random, params";
      mockSendTelegramMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendTelegramMessage).toHaveBeenCalledWith(
        "Unknown command. Type `help` for guidance."
      );
      expect(mockCreateBudgetEntry).not.toHaveBeenCalled();
      expect(mockCreateTaskEntry).not.toHaveBeenCalled();
      expect(mockCreateMealEntry).not.toHaveBeenCalled();
      expect(mockSendHelpMessage).not.toHaveBeenCalled();
    });

    test("should handle numeric flags as unknown commands", async () => {
      // Arrange
      const message = "123, test, params";
      mockSendTelegramMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendTelegramMessage).toHaveBeenCalledWith(
        "Unknown command. Type `help` for guidance."
      );
    });

    test("should handle special characters as unknown commands", async () => {
      // Arrange
      const message = "@, test, params";
      mockSendTelegramMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendTelegramMessage).toHaveBeenCalledWith(
        "Unknown command. Type `help` for guidance."
      );
    });
  });

  describe("Error handling", () => {
    test("should handle errors thrown by createBudgetEntry", async () => {
      // Arrange
      const message = "b, 100, Food, Groceries";
      const error = new Error("Database connection failed");
      mockCreateBudgetEntry.mockRejectedValue(error);
      mockSendTelegramMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendTelegramMessage).toHaveBeenCalledWith(
        "Oops! Something went wrong. Double-check your format or type `help`."
      );
    });

    test("should handle errors thrown by createTaskEntry", async () => {
      // Arrange
      const message = "t, Task name, chore";
      const error = new Error("Notion API error");
      mockCreateTaskEntry.mockRejectedValue(error);
      mockSendTelegramMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendTelegramMessage).toHaveBeenCalledWith(
        "Oops! Something went wrong. Double-check your format or type `help`."
      );
    });

    test("should handle errors thrown by sendHelpMessage", async () => {
      // Arrange
      const message = "h, budget";
      const error = new Error("Help system error");
      mockSendHelpMessage.mockRejectedValue(error);
      mockSendTelegramMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendTelegramMessage).toHaveBeenCalledWith(
        "Oops! Something went wrong. Double-check your format or type `help`."
      );
    });

    test("should handle parsing errors from malformed input", async () => {
      // Arrange - This could happen if messageText is null or undefined
      mockSendTelegramMessage.mockResolvedValue(undefined);

      // Act - Force an error by passing null (this would cause .trim() to fail)
      await parseAndRoute(null as any);

      // Assert
      expect(mockSendTelegramMessage).toHaveBeenCalledWith(
        "Oops! Something went wrong. Double-check your format or type `help`."
      );
    });
  });

  describe("Edge cases and input variations", () => {
    test("should handle message with only flag and no parameters", async () => {
      // Arrange
      const message = "b";
      const expectedParams: string[] = [];
      mockCreateBudgetEntry.mockResolvedValue({
        success: true,
        message: "Success",
      });

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockCreateBudgetEntry).toHaveBeenCalledWith(expectedParams);
    });

    test("should handle message with extra commas", async () => {
      // Arrange
      const message = "t,,,Task name,,,chore,,,";
      const expectedParams = ["", "", "Task name", "", "", "chore", "", "", ""];
      mockCreateTaskEntry.mockResolvedValue({
        success: true,
        message: "Success",
      });

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockCreateTaskEntry).toHaveBeenCalledWith(expectedParams);
    });

    test("should handle message with leading/trailing whitespace", async () => {
      // Arrange
      const message = "   b  , 100.00 , Food , Groceries   ";
      const expectedParams = ["100.00", "Food", "Groceries"];
      mockCreateBudgetEntry.mockResolvedValue({
        success: true,
        message: "Success",
      });

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockCreateBudgetEntry).toHaveBeenCalledWith(expectedParams);
    });

    test("should handle single character input", async () => {
      // Arrange
      const message = "b";
      mockCreateBudgetEntry.mockResolvedValue({
        success: true,
        message: "Success",
      });

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockCreateBudgetEntry).toHaveBeenCalledWith([]);
    });

    test("should handle empty string input", async () => {
      // Arrange
      const message = "";
      mockSendTelegramMessage.mockResolvedValue(undefined);

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockSendTelegramMessage).toHaveBeenCalledWith(
        "Unknown command. Type `help` for guidance."
      );
    });

    test("should handle mixed case flags", async () => {
      // Arrange
      const message = "B, 50.00, Coffee";
      const expectedParams = ["50.00", "Coffee"];
      mockCreateBudgetEntry.mockResolvedValue({
        success: true,
        message: "Success",
      });

      // Act
      await parseAndRoute(message);

      // Assert
      expect(mockCreateBudgetEntry).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe("Return value propagation", () => {
    test("should return value from createBudgetEntry", async () => {
      // Arrange
      const message = "b, 100, Food";
      const expectedReturn = {
        success: true,
        message: "Budget created successfully",
      };
      mockCreateBudgetEntry.mockResolvedValue(expectedReturn);

      // Act
      const result = await parseAndRoute(message);

      // Assert
      expect(result).toBe(expectedReturn);
    });

    test("should return value from createTaskEntry", async () => {
      // Arrange
      const message = "t, Task name";
      const expectedReturn = {
        success: false,
        message: "Task creation failed",
      };
      mockCreateTaskEntry.mockResolvedValue(expectedReturn);

      // Act
      const result = await parseAndRoute(message);

      // Assert
      expect(result).toBe(expectedReturn);
    });

    test("should return undefined for help commands", async () => {
      // Arrange
      const message = "h, budget";
      mockSendHelpMessage.mockResolvedValue(undefined);

      // Act
      const result = await parseAndRoute(message);

      // Assert
      expect(result).toBeUndefined();
    });

    test("should return undefined for unknown commands", async () => {
      // Arrange
      const message = "xyz, params";
      mockSendTelegramMessage.mockResolvedValue(undefined);

      // Act
      const result = await parseAndRoute(message);

      // Assert
      expect(result).toBeUndefined();
    });
  });
});
