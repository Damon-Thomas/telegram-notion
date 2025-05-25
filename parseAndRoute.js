import { createBudgetEntry } from "./budget.js";
import { createTaskEntry } from "./tasks.js";
import { createMealEntry } from "./meals.js";
import { sendHelpMessage } from "./help.js";

export async function parseAndRoute(messageText) {
  const [flag, ...rest] = messageText.trim().split(" ");
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
      throw new Error('Unknown flag. Send "h" for help.');
  }
}
