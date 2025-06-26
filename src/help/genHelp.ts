import { sendTelegramMessage } from "../utils/telegramMessage.js";

export default async function sendGeneralHelpMessage() {
  sendTelegramMessage(
    "Welcome to the General Help Bot! Here’s how to use it:\n\n" +
      "1. **Flags include \n\n" +
      "   - `b,` for Budget Tracker\n" +
      "   - `t,` for Task Tracker\n" +
      "   - `d,` for Diet Tracker\n" +
      "   - `h, -b` or `help budget` for Budget Help\n\n" +
      "   - `h, -t` or `help task` for Task Help\n\n" +
      "   - `h, -d` or `help diet` for Diet Help\n\n" +
      "2. **View Entries**: Type `view budget`, `view tasks`, or `view diet` to see your entries.\n\n" +
      "3. **Help**: Type `help` to see this message again.\n\n" +
      "For more assistance, contact support."
  );
}
