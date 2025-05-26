import { createBudgetEntry } from "./budget.js";
import { createTaskEntry } from "./tasks.js";
import { createMealEntry } from "./meals.js";
import { sendHelpMessage } from "./help.js";

export async function parseAndRoute(messageText) {
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
        await sendMessage(chatId, "Unknown command. Type `help` for guidance.");
    }
  } catch (error) {
    console.error("Error in handleMessage:", error);
    await sendMessage(
      chatId,
      "Oops! Something went wrong. Double-check your format or type `help`."
    );
  }
}
