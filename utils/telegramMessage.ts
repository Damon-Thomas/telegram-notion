import axios from "axios";
import dotenv from "dotenv";
import { get } from "http";
import { getChatId } from "../context/context";

dotenv.config();

export const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

type SendTelegramMessage = (text: string) => Promise<void>;

export const sendTelegramMessage: SendTelegramMessage = async (text) => {
  const chatId = getChatId();
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
