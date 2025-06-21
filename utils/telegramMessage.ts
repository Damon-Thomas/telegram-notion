import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

type SendTelegramMessage = (
  chatId: number | null,
  text: string
) => Promise<void>;

export const sendTelegramMessage: SendTelegramMessage = async (
  chatId,
  text
) => {
  if (!chatId) {
    console.warn("sendTelegramMessage: No chat ID provided.");
    return;
  }
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
  } catch (error: any) {
    console.error(`Error sending message: ${error.message}`);
  }
};
