import { sendTelegramMessage } from "../utils/telegramMessage.js";

export default async function sendUnkownHelpMessage() {
  await sendTelegramMessage(
    "Unknown command. Please use one of the following help formats:\n\n" +
      "1. **Budget Help**: Type `h -b` or `help budget` for Budget Tracker assistance.\n" +
      "2. **Task Help**: Type `h -t` or `help task` for Task Tracker assistance.\n" +
      "3. **Meal Help**: Type `h -m` or `help meal` for Meal Tracker assistance.\n" +
      "4. **General Help**: Type `help` for general assistance.\n\n" +
      "For more assistance, please contact support."
  );
}
