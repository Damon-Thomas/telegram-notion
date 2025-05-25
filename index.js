import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { Client } from "@notionhq/client";
import { parseAndRoute } from "./parseAndRoute.js";
import { setContext } from "./context.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
export const databaseId = process.env.NOTION_BUDGET_DB_ID;

app.use(bodyParser.json());

// Inside your Express route:
app.post("/webhook", async (req, res) => {
  const message = req.body.message?.text;
  const chatId = req.body.message?.chat.id;

  async function sendTelegramMessage(chatId, text) {
    try {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: text,
      });
    } catch (error) {
      console.error(`Error sending message: ${error.message}`);
    }
  }

  setContext(chatId, sendTelegramMessage);

  if (message) {
    try {
      await parseAndRoute(message, chatId, sendTelegramMessage);
      res.send("Processed.");
    } catch (err) {
      console.error(err);
      await sendTelegramMessage(chatId, "Error: " + err.message);
      res.status(500).send("Error");
    }
  } else {
    res.status(200).send("No text.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
