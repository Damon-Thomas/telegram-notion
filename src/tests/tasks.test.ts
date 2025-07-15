import { createTaskEntry } from "../tasks";
import * as telegramModule from "../utils/telegramMessage";
import * as textParserModule from "../utils/textParser";

// Mock the dependencies
jest.mock("../app.js", () => ({
  notion: {
    pages: {
      create: jest.fn(),
    },
  },
}));

jest.mock("../utils/telegramMessage");
jest.mock("../utils/textParser");

// Import the mocked notion after mocking
import { notion } from "../app.js";

const mockSendTelegramMessage =
  telegramModule.sendTelegramMessage as jest.MockedFunction<
    typeof telegramModule.sendTelegramMessage
  >;
const mockParseTaskInput =
  textParserModule.parseTaskInput as jest.MockedFunction<
    typeof textParserModule.parseTaskInput
  >;
const mockNotionPagesCreate = notion.pages.create as jest.MockedFunction<
  typeof notion.pages.create
>;

describe("createTaskEntry", () => {
  // Set up environment variable
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NOTION_TASK_DB_ID = "test-db-id";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should successfully create a task with full details", async () => {
    // Arrange
    const input = [
      "Buy groceries",
      "chore",
      "h",
      "d Apr15",
      "f weekly",
      "n Don't forget milk",
    ];
    const mockParsedData = {
      Name: "Buy groceries",
      Tag: "chore",
      Priority: "High",
      Date: "2025-04-15",
      Frequency: "weekly",
      Notes: "Don't forget milk",
    };

    mockParseTaskInput.mockReturnValue(mockParsedData);
    mockNotionPagesCreate.mockResolvedValue({} as any);
    mockSendTelegramMessage.mockResolvedValue(undefined);

    // Act
    const result = await createTaskEntry(input);

    // Assert
    expect(mockParseTaskInput).toHaveBeenCalledWith(input);
    expect(mockNotionPagesCreate).toHaveBeenCalledWith({
      parent: { database_id: "test-db-id" },
      properties: {
        Task: {
          title: [{ text: { content: "Buy groceries" } }],
        },
        Status: {
          select: { name: "To Do" },
        },
        Type: {
          select: { name: "chore" },
        },
        Due: {
          date: { start: "2025-04-15" },
        },
        Frequency: {
          select: { name: "weekly" },
        },
        Priority: {
          select: { name: "High" },
        },
        Notes: {
          rich_text: [{ text: { content: "Don't forget milk" } }],
        },
      },
    });

    expect(mockSendTelegramMessage).toHaveBeenCalledWith(
      expect.stringContaining("✅ Task created successfully!")
    );
    expect(result).toEqual({
      success: true,
      message: "Task created successfully!",
    });
  });

  test("should create task with default values when optional fields are missing", async () => {
    // Arrange
    const input = ["Simple task"];
    const mockParsedData = {
      Name: "Simple task",
      Tag: "general",
      Priority: "",
      Date: "",
      Frequency: "",
      Notes: "",
    };

    mockParseTaskInput.mockReturnValue(mockParsedData);
    mockNotionPagesCreate.mockResolvedValue({} as any);
    mockSendTelegramMessage.mockResolvedValue(undefined);

    // Act
    const result = await createTaskEntry(input);

    // Assert
    expect(mockNotionPagesCreate).toHaveBeenCalledWith({
      parent: { database_id: "test-db-id" },
      properties: {
        Task: {
          title: [{ text: { content: "Simple task" } }],
        },
        Status: {
          select: { name: "To Do" },
        },
        Type: {
          select: { name: "general" },
        },
        Due: {
          date: { start: "" },
        },
        Frequency: {
          select: { name: "None" },
        },
        Priority: {
          select: { name: "Low" },
        },
        Notes: {
          rich_text: [{ text: { content: "" } }],
        },
      },
    });

    expect(result.success).toBe(true);
  });

  test("should handle Notion API errors gracefully", async () => {
    // Arrange
    const input = ["Task that will fail"];
    const mockParsedData = {
      Name: "Task that will fail",
      Tag: "general",
      Priority: "Low",
      Date: "",
      Frequency: "None",
      Notes: "",
    };

    mockParseTaskInput.mockReturnValue(mockParsedData);
    const notionError = new Error("Notion API rate limit exceeded");
    mockNotionPagesCreate.mockRejectedValue(notionError);
    mockSendTelegramMessage.mockResolvedValue(undefined);

    // Act
    const result = await createTaskEntry(input);

    // Assert
    expect(mockSendTelegramMessage).toHaveBeenCalledWith(
      "Error creating task: Notion API rate limit exceeded"
    );
    expect(result).toEqual({
      success: false,
      message: "Error creating task: Notion API rate limit exceeded",
    });
  });

  test("should handle unknown errors", async () => {
    // Arrange
    const input = ["Task with unknown error"];
    const mockParsedData = {
      Name: "Task with unknown error",
      Tag: "general",
      Priority: "Low",
      Date: "",
      Frequency: "None",
      Notes: "",
    };

    mockParseTaskInput.mockReturnValue(mockParsedData);
    // Throw a non-Error object to simulate unknown error
    mockNotionPagesCreate.mockRejectedValue("Unknown error");
    mockSendTelegramMessage.mockResolvedValue(undefined);

    // Act
    const result = await createTaskEntry(input);

    // Assert
    expect(mockSendTelegramMessage).toHaveBeenCalledWith(
      "Error creating task due to an unknown error. Please check the logs."
    );
    expect(result).toEqual({
      success: false,
      message:
        "Error creating task due to an unknown error. Please check the logs.",
    });
  });

  test("should handle case when parseTaskInput returns null/undefined", async () => {
    // Arrange
    const input = ["Invalid input"];

    // Mock parseTaskInput to return null
    mockParseTaskInput.mockReturnValue(null as any);
    mockSendTelegramMessage.mockResolvedValue(undefined);

    // Act
    const result = await createTaskEntry(input);

    // Assert
    expect(mockSendTelegramMessage).toHaveBeenCalledWith(
      "Error creating task: Cannot read properties of null (reading 'Name')"
    );
    expect(result).toEqual({
      success: false,
      message:
        "Error creating task: Cannot read properties of null (reading 'Name')",
    });
  });

  test("should use empty string as database_id when NOTION_TASK_DB_ID is not set", async () => {
    // Arrange
    delete process.env.NOTION_TASK_DB_ID;
    const input = ["Test task"];
    const mockParsedData = {
      Name: "Test task",
      Tag: "general",
      Priority: "Low",
      Date: "",
      Frequency: "None",
      Notes: "",
    };

    mockParseTaskInput.mockReturnValue(mockParsedData);
    mockNotionPagesCreate.mockResolvedValue({} as any);
    mockSendTelegramMessage.mockResolvedValue(undefined);

    // Act
    await createTaskEntry(input);

    // Assert
    expect(mockNotionPagesCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        parent: { database_id: "" },
      })
    );
  });

  test("should include all parsed data in success message", async () => {
    // Arrange
    const input = [
      "Complete project",
      "project",
      "h",
      "d Dec25",
      "f monthly",
      "n Year-end deadline",
    ];
    const mockParsedData = {
      Name: "Complete project",
      Tag: "project",
      Priority: "High",
      Date: "2025-12-25",
      Frequency: "monthly",
      Notes: "Year-end deadline",
    };

    mockParseTaskInput.mockReturnValue(mockParsedData);
    mockNotionPagesCreate.mockResolvedValue({} as any);
    mockSendTelegramMessage.mockResolvedValue(undefined);

    // Act
    await createTaskEntry(input);

    // Assert
    const expectedMessage = `✅ Task created successfully!
------------------------------------------------------
📝 Task: Complete project
📌 Type: project
⚡ Priority: High
📅 Due: 2025-12-25
🔁 Frequency: monthly
🗒️ Notes: Year-end deadline`;

    expect(mockSendTelegramMessage).toHaveBeenCalledWith(expectedMessage);
  });
});
