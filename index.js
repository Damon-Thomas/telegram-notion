require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const body = req.body;

  const message = body.message?.text || "";
  const chatId = body.message?.chat.id;
  console.log(`Received message: ${message} from chatId: ${chatId}`);
  // Parse the message (category, amount, store)
  const parts = message.split(" ");
  if (parts.length < 3) {
    await sendMessage(
      chatId,
      "Format: category amount store\nExample: groceries 24.99 walmart"
    );
    return res.sendStatus(200);
  }

  const category = parts[0];
  let amount = parts[1];
  if (amount.startsWith("+")) {
    amount = parseFloat(amount.slice(1));
  } else {
    amount = -Math.abs(parseFloat(amount));
  }
  amount = parseFloat(amount.toFixed(2));
  const company = parts.slice(2).join(" ");
  const today = new Date().toISOString();

  async function sendMessage(chatId, text) {
    try {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: text,
      });
    } catch (error) {
      console.error(`Error sending message: ${error.message}`);
    }
  }

  // Push to Notion
  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_BUDGET_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: company } }],
        },
        Amount: {
          number: amount,
        },
        Category: {
          select: { name: category },
        },
        Company: {
          rich_text: [{ text: { content: company } }],
        },
        Date: {
          date: { start: today },
        },
      },
    });

    await sendMessage(
      chatId,
      `Logged ${category} $${amount.toFixed(2)} at ${company}.`
    );
  } catch (error) {
    console.error(error);
    await sendMessage(chatId, `Error saving to Notion: ${error.message}`);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
