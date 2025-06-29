import queryBudgetDatabase from "./data/budget/getBudgetDB.js";
import { capitalizeFirst } from "./utils/capitalizeFirst.js";
import { sendTelegramMessage } from "./utils/telegramMessage.js";
import createNotionPage from "./data/budget/createNotionPage.js";

export async function createBudgetEntry(rawInput: string[]) {
  console.log(`Creating budget entry with input: ${rawInput}`);
  let data;
  try {
    data = await parseBudgetInput(rawInput);
    if (!data) {
      return;
    }
    console.log(
      `Parsed data: Name = ${data.Name}, Amount = ${data.Amount}, Category = ${data.Category}, Type = ${data.Type}, Notes = ${data.Notes}`
    );
    const pageCreated = (await createNotionPage("budget", data)) || {
      success: false,
      message: "Failed to create Notion page",
    };
    if (!pageCreated.success && pageCreated.message) {
      console.error(`Error creating budget entry: ${pageCreated.message}`);
      await sendTelegramMessage(
        `Error creating budget entry: ${pageCreated.message}`
      );
      return {
        success: false,
        message: pageCreated.message,
      };
    }
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
  try {
    let head = parts[0].trim();
    let alt;
    console.log(`Parsing budget input: ${head}`);
    if (head.startsWith("view")) {
      // Handle view command
      alt = "view";
      const viewName = head.slice(4).trim();
      console.log(`View command detected: ${viewName}`);
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
    console.log(`Parsed amount: ${parts}`);

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
