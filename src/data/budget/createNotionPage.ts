import { notion } from "../../app";

interface BudgetData {
  Name: string;
  Date: string;
  Amount: number;
  Category: string;
  Type: string;
  Notes: string;
}

interface NotionResponse {
  success: boolean;
  message: string;
}

export default async function createNotionPage(
  database: "budget",
  data: BudgetData
): Promise<void | NotionResponse> {
  let databaseId;
  if (database === "budget") {
    databaseId = process.env.NOTION_BUDGET_DB_ID || "";
    createBudgetNotionPage(databaseId, data);
  }
}

async function createBudgetNotionPage(databaseId: string, data: BudgetData) {
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [{ text: { content: data.Name } }],
        },
        Date: {
          date: { start: data.Date },
        },
        Amount: {
          number: data.Amount,
        },
        Category: {
          select: { name: data.Category },
        },
        Type: {
          select: { name: data.Type },
        },
        Notes: { rich_text: [{ text: { content: data.Notes } }] },
      },
    });
    return {
      success: true,
      message: "Notion page created successfully",
    };
  } catch (error) {
    console.error("Error creating Notion page:", error);
    return {
      success: false,
      message: `Error creating Notion page: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
