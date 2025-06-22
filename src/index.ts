import dotenv from "dotenv";
import express, { Request, Response } from "express"; // Add Request/Response import
import bodyParser from "body-parser";
import { Client } from "@notionhq/client";
import { parseAndRoute } from "./parseAndRoute.js";
import { sendTelegramMessage } from "./utils/telegramMessage.js";
import { setChatId } from "./context/context.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

export const notion = new Client({ auth: process.env.NOTION_TOKEN });

app.use(bodyParser.json());

app.post("/webhook", async (req: Request, res: Response) => {
  const message: string | undefined = req.body.message?.text;
  const chatId: number | undefined = req.body.message?.chat?.id;
  if (!message || !chatId) {
    res.status(200).send("Invalid request: No message or chat ID.");
    return;
  }

  setChatId(chatId);

  try {
    await parseAndRoute(message);
    res.send("Processed.");
    return;
  } catch (err: any) {
    console.error(err);
    await sendTelegramMessage("Error: " + err.message);
  }

  res.sendStatus(200); // Always respond to prevent Telegram retrying
  return;
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
