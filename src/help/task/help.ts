import { sendTelegramMessage } from "../../utils/telegramMessage.js";

export default async function sendTaskHelpMessage() {
  sendTelegramMessage(
    "Welcome to the Task Tracker Bot! Here’s how to use it:\n\n" +
      "1. **Create a Task Entry**: Use the format: \n`t, Name, Description, Due Date, Priority, Notes`\n" +
      "   - Example: `t, Finish report, Complete the quarterly report, 2023-10-31, High, Urgent task`\n\n" +
      "2. **View Task Entries**:" +
      " Type `view tasks` to see your entries.\n\n" +
      "3. **Help**: Type `help` to see this message again.\n\n" +
      "For more assistance, contact support."
  );
}
