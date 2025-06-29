import { sendTelegramMessage } from "../../utils/telegramMessage.js";
import { notion } from "../../app.js";
import getAfterDate from "../../utils/getAfterDate.js";

// type BudgetResponse = { results: { properties: BudgetEntry }[] };
export default async function queryBudgetDatabase(date: string | null = null) {
  let dateFilter = getAfterDate(date);
  const response = await notion.databases.query({
    database_id: process.env.NOTION_BUDGET_DB_ID || "",
    filter: {
      property: "Date",
      date: {
        after: dateFilter.toISOString() || new Date().toISOString(),
      },
    },
  });
  console.log(`Fetched ${response.results.length} budget entries. ${response}`);
  const budgetEntries: BudgetEntry[] = [];
  for (const page of response.results) {
    if ("properties" in page) {
      budgetEntries.push(parseBudgetInput(page.properties));
    }
  }
  if (budgetEntries.length > 0) {
    let otherTotal = 0;
    const total = budgetEntries.reduce((sum, entry) => {
      console.log(entry.Amount);
      otherTotal += entry.Amount?.number ?? 0;

      return sum + (entry.Amount?.number ?? 0);
    }, 0);
    //total not working
    sendTelegramMessage(
      `Total Transactions: ${budgetEntries.length}\nTotal Amount: ${total}`
    );
  }
  return;
}

type BudgetEntry = {
  Category: { select: { name: string } } | null;
  Amount: { number: number } | null;
  Notes: { rich_text: { text: { content: string } }[] } | null;
  Date: { date: { start: string } } | null;
  Type: { select: { name: string } } | null;
  Name: { title: { text: { content: string } }[] } | null;
};

function parseBudgetInput(rawInput: Record<string, any>) {
  return {
    Category: rawInput.Category?.select?.name || null,
    Amount: rawInput.Amount?.number || null,
    Notes: rawInput.Notes?.rich_text[0]?.text.content || "",
    Date: rawInput.Date?.date?.start || null,
    Type: rawInput.Type?.select?.name || null,
    Name: rawInput.Name?.title[0]?.text.content || "",
  } as BudgetEntry;
}
