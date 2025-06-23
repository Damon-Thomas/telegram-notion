import { sendTelegramMessage } from "../../utils/telegramMessage.js";

export default async function sendBudgetHelpMessage() {
  sendTelegramMessage(
    "Welcome to the Budget Tracker Bot! Here’s how to use it:\n\n" +
      "1. **Create a Budget Entry**: Use the format: \n`b, Name, Amount, Category, Type, Notes`\n" +
      "   - Example: `b, Groceries, 50, Food, Expense, Weekly grocery shopping`\n\n" +
      "2. **View Budget Entries**: Type `view budget` to see your entries.\n\n" +
      "3. **Help**: Type `help` to see this message again.\n\n" +
      "For more assistance, contact support."
  );
}
