import { createBudgetEntry } from "./budget.js"; // keep .js for local relative
import { createTaskEntry } from "./tasks.js";
import { createMealEntry } from "./meals.js";
import { sendHelpMessage } from "./help/help.js";
import { sendTelegramMessage } from "./utils/telegramMessage.js"; // remove .js

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
        return await sendHelpMessage(rest[0]?.toLowerCase());
      case "help":
        return await sendHelpMessage(rest[0]?.toLowerCase());
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
