import { notion } from "./index.js"; // local relative, keep .js
import { capitalizeFirst } from "./utils/capitalizeFirst.js"; // remove .js from alias
import { sendTelegramMessage } from "./utils/telegramMessage.js"; // remove .js

export async function createBudgetEntry(rawInput: string[]) {
  const databaseId = process.env.NOTION_BUDGET_DB_ID || "";

  console.log(`Creating budget entry with input: ${rawInput}`);
  let data;
  try {
    data = await parseBudgetInput(rawInput);
    if (!data) {
      sendTelegramMessage(
        "Error: No data returned from parseBudgetInput. Please check your input format."
      );
      return {
        success: false,
        message: "Error: No data returned from parseBudgetInput.",
      };
    }
    console.log(
      `Parsed data: Name = ${data.Name}, Amount = ${data.Amount}, Category = ${data.Category}, Type = ${data.Type}, Notes = ${data.Notes}`
    );
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
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error creating budget entry: ${error.message}`);
      await sendTelegramMessage(
        `Error creating budget entry: ${error.message}`
      );
    } else {
      console.error("Unknown error creating budget entry:", error);
      await sendTelegramMessage(
        `Error creating budget entry due to an unknown error. Please check the logs.`
      );
      return {
        success: false,
        message: "Error creating budget entry due to an unknown error.",
      };
    }
    return {
      success: false,
      message: `Error creating budget entry: ${error.message}`,
    };
  }
  if (data) {
    await sendTelegramMessage(
      `Budget entry created successfully!
------------------------------------------------------
Name: ${data.Name}
Amount: $${data.Amount.toFixed(2)}
Category: ${data.Category}
Type: ${data.Type}
Notes: ${data.Notes}`
    );
    return {
      success: true,
      message: "Budget entry created successfully!",
    };
  } else {
    await sendTelegramMessage("Error: No data returned from parseBudgetInput.");
    return {
      success: false,
      message: "Error: No data returned from parseBudgetInput.",
    };
  }
}

export async function parseBudgetInput(parts: string[]) {
  if (parts.length < 3) {
    await sendTelegramMessage(
      "Format: amount category company\nExample: 24.99 groceries walmart"
    );
    return;
  }
  let amountStr = parts[0];
  let amount: number;
  if (amountStr.startsWith("+")) {
    amount = parseFloat(amountStr.slice(1));
  } else {
    amount = -Math.abs(parseFloat(amountStr));
  }
  amount = Math.round(amount * 100) / 100; // Ensures two decimals, but as a number
  console.log(`Parsed amount: ${amount}`);
  const category = capitalizeFirst(parts[1]);
  const name = capitalizeFirst(parts[2]);
  // Support notes after a dash
  const dashIndex = parts.indexOf("-");
  const notes = dashIndex !== -1 ? parts.slice(dashIndex + 1).join(" ") : "";
  const type = amount < 0 ? "Expense" : "Income";

  return {
    Amount: amount,
    Category: category,
    Name: name,
    Type: type,
    Notes: notes,
    Date: new Date().toISOString(),
  };
}
