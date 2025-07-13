import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { Client } from "@notionhq/client";
import { parseAndRoute } from "./parseAndRoute.js";
import { sendTelegramMessage } from "./utils/telegramMessage.js";
import { setChatId } from "./context/context.js";

export const app = express();
export const notion = new Client({ auth: process.env.NOTION_TOKEN });

app.use(bodyParser.json());

app.post(
  "/webhook",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message: string | undefined = req.body.message?.text;
      const chatId: number | undefined = req.body.message?.chat?.id;

      if (!message || !chatId) {
        res.status(400).send("Invalid request: No message or chat ID.");
        return;
      }

      console.log(`Received message: ${message} from chat ID: ${chatId}`);
      setChatId(chatId);

      await parseAndRoute(message);
      res.status(200).send("Processed.");
    } catch (error) {
      next(error);
    }
  }
);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);

  // For Telegram webhooks, always respond with 200
  // A proper error code would cause Telegram to retry indefinitely
  // Send a simple acknowledgment
  if (!res.headersSent) {
    res.status(200).json({
      status: "error",
      message: "Internal error occurred",
    });
  }

  // Notify user via Telegram
  if (err.message) {
    sendTelegramMessage(`System error: ${err.message}`).catch((telegramErr) => {
      console.error("Failed to send error message to Telegram:", telegramErr);
    });
  }
});

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  sendTelegramMessage("Critical system error occurred").catch(() => {});
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  sendTelegramMessage("System error: Unhandled promise rejection").catch(
    () => {}
  );
});
