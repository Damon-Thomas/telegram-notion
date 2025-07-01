import queryBudgetDatabase from "./data/budget/getBudgetDB.js";
import { capitalizeFirst } from "./utils/capitalizeFirst.js";
import { sendTelegramMessage } from "./utils/telegramMessage.js";
import createNotionPage from "./data/budget/createNotionPage.js";

export async function createBudgetEntry(rawInput: string[]) {
  let data;
  try {
    data = await parseBudgetInput(rawInput);
    if (!data) {
      sendTelegramMessage(
        "Failed to parse budget input. Please check the format."
      );
      return {
        success: false,
        message: "Failed to parse budget input. Please check the format.",
      };
    }
    await createNotionPage("budget", data);
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
    }
  } catch (error) {
    console.error(`Error creating budget entry: ${error}`);
    return {
      success: false,
      message: `Error creating budget entry`,
    };
  }
}

export async function parseBudgetInput(parts: string[]) {
  try {
    let head = parts[0].trim();
    let alt;
    console.log(`Parsing budget input: ${head}`);
    if (head.startsWith("view")) {
      // Handle view command
      alt = "view";
      const viewName = head.slice(4).trim();
      await sendTelegramMessage(`Viewing budget entries for: ${viewName}`);
      if (viewName === "day") {
        queryBudgetDatabase(viewName);
      } else if (viewName === "week") {
        queryBudgetDatabase(viewName);
      } else if (viewName === "month") {
        queryBudgetDatabase(viewName);
      } else {
        await sendTelegramMessage(
          `Unknown view command: ${viewName}. Please use 'day', 'week', or 'month'.`
        );
      }
      return null;
    }
    if (parts.length < 3) {
      await sendTelegramMessage(
        "Format: amount category company\nExample: 24.99 groceries walmart"
      );
      return null;
    }
    alt = parts[0].startsWith("+") ? "income" : "expense";
    let amountStr = head;
    let amount: number;
    if (amountStr.startsWith("+")) {
      amount = parseFloat(amountStr.slice(1));
    } else {
      amount = -Math.abs(parseFloat(amountStr));
    }
    amount = Math.round(amount * 100) / 100; // Ensures two decimals, but as a number

    const category = capitalizeFirst(parts[1]);
    const name = capitalizeFirst(parts[2]);

    const notes = parts.slice(3).join(" ").trim() || "";
    const type = amount < 0 ? "Expense" : "Income";

    return {
      Alt: alt,
      Amount: amount,
      Category: category,
      Name: name,
      Type: type,
      Notes: notes,
      Date: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error parsing budget input: ${error}`);
    await sendTelegramMessage(
      `Error parsing budget input: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return null;
  }
}
