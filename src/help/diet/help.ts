import { sendTelegramMessage } from "../../utils/telegramMessage.js";

export default async function sendDietHelpMessage() {
  sendTelegramMessage(
    "Welcome to the Diet Tracker Bot! Here’s how to use it:\n\n" +
      "1. **Create a Meal Entry**: Use the format: \n`m, Name, Calories, Protein, Carbs, Fats, Notes`\n" +
      "   - Example: `m, Chicken Salad, 350, 30g, 20g, 15g, Healthy lunch option`\n\n" +
      "2. **View Meal Entries**: Type `view meals` to see your entries.\n\n" +
      "3. **Help**: Type `help` to see this message again.\n\n" +
      "For more assistance, contact support."
  );
}
