import dotenv from "dotenv";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { Client } from "@notionhq/client";
import { parseAndRoute } from "./parseAndRoute";
import { setContext } from "./context";
import { sendTelegramMessage } from "./utils/telegramMessage";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

export const notion = new Client({ auth: process.env.NOTION_TOKEN });

app.use(bodyParser.json());

app.post("/webhook", async (req: Request, res: Response) => {
  const message: string | undefined = req.body.message?.text;
  const chatId: number | undefined = req.body.message?.chat?.id;
  if (!message || !chatId) {
    return res.status(200).send("Invalid request: No message or chat ID.");
  }

  setContext(chatId, sendTelegramMessage);

  try {
    await parseAndRoute(message);
    res.send("Processed.");
    return;
  } catch (err: any) {
    console.error(err);
    await sendTelegramMessage(chatId, "Error: " + err.message);
  }

  res.sendStatus(200); // Always respond to prevent Telegram retrying
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
