import { createBudgetEntry } from "./budget";
import { createTaskEntry } from "./tasks";
import { createMealEntry } from "./meals";
import { sendHelpMessage } from "./help";
import { sendTelegramMessage } from "@utils/telegramMessage";

export async function parseAndRoute(messageText: string) {
  console.log(`Parsing and routing message: ${messageText}`);
  try {
    const [flag, ...rest] = messageText
      .trim()
      .split(",")
      .map((s) => s.trim());
    console.log(`Received message: ${rest} with flag: ${flag}`);
    switch (flag.toLowerCase()) {
      case "b":
        return await createBudgetEntry(rest);
      case "t":
        return await createTaskEntry(rest);
      case "m":
        return await createMealEntry(rest);
      case "h":
      case "help":
        return await sendHelpMessage();
      default:
        await sendTelegramMessage("Unknown command. Type `help` for guidance.");
    }
  } catch (error) {
    console.error("Error in handleMessage:", error);
    await sendTelegramMessage(
      "Oops! Something went wrong. Double-check your format or type `help`."
    );
  }
}
