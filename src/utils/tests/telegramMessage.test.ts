import { sendTelegramMessage } from "../telegramMessage";

describe("sendTelegramMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should send a message to the Telegram API", async () => {
    const mockChatId = "123456789";
    const mockText = "Hello, World!";
    const mockAxiosPost = jest
      .spyOn(require("axios"), "post")
      .mockResolvedValue({});

    // Mock getChatId to return a specific chat ID
    jest
      .spyOn(require("../../context/context"), "getChatId")
      .mockReturnValue(mockChatId);

    await sendTelegramMessage(mockText);

    expect(mockAxiosPost).toHaveBeenCalledWith(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: mockChatId,
        text: mockText,
      }
    );
  });

  test("should log a warning if no chat ID is provided", async () => {
    jest
      .spyOn(require("../../context/context"), "getChatId")
      .mockReturnValue(null);
    console.warn = jest.fn();

    await sendTelegramMessage("Test message");

    expect(console.warn).toHaveBeenCalledWith(
      "sendTelegramMessage: No chat ID provided."
    );
  });

  test("should handle errors gracefully", async () => {
    const mockError = new Error("Network error");
    const mockChatId = "123456789"; // Add this line

    // Mock getChatId to return a valid chat ID so we reach the error handling
    jest
      .spyOn(require("../../context/context"), "getChatId")
      .mockReturnValue(mockChatId);

    jest.spyOn(require("axios"), "post").mockRejectedValue(mockError);
    console.error = jest.fn();

    await sendTelegramMessage("Test message");

    expect(console.error).toHaveBeenCalledWith(
      `Error sending message: ${mockError.message}`
    );
  });
});
