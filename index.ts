import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { Client } from "@notionhq/client";
import { parseAndRoute } from "./parseAndRoute";
import { setContext } from "./context";
import { sendTelegramMessage } from "./utils/telegramMessage";
import { Request, Response } from "express";

dotenv.config();

interface MessageRequest extends Request {
  body: {
    message?: {
      text?: string;
      chat?: {
        id?: number;
      };
    };
  };
}

const app = express();
const PORT = process.env.PORT || 3000;

export const notion = new Client({ auth: process.env.NOTION_TOKEN });

app.use(bodyParser.json());

app.post("/webhook", async (req: MessageRequest, res: Response) => {
  const message: string | undefined = req.body.message?.text;
  const chatId: number | undefined = req.body.message?.chat?.id;
  if (!message || !chatId) {
    res.status(200).send("Invalid request: No message or chat ID.");
    return;
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
  return;
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
