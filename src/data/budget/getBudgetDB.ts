import { notion } from "src";

export default async function queryBudgetDatabase() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_BUDGET_DB_ID || "",
  });
  console.log(`Fetched ${response.results.length} budget entries. ${response}`);
  return;
  //   return response.results.map(page => {
  //     const name = page.properties.Name.title[0]?.plain_text;
  //     const amount = page.properties.Amount.number;
  //     return `${name}: $${amount}`;
  //   }).join('\n');
}
