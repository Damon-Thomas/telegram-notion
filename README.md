# telegram-notion

---

.env Variables Needed

Create a telegram bot and place the api token here

TELEGRAM_BOT_TOKEN

Create notion db and put tokens here

NOTION_TOKEN

NOTION_BUDGET_DB_ID

NOTION_TASK_DB_ID

---

To run locally

npm run start

ngrok http 3000

copy forwarding url

run curl -X POST https://api.telegram.org/bot<Telegram_API>/setWebhook \
 -d url=<Forwarding_URL_HERE>/webhook

---
