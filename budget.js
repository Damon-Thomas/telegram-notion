import { getContext } from "./context.js";
import { notion } from "./index.js";
import { databaseId } from "./index.js";
import { capitalizeFirst } from "./utils.js";

export async function createBudgetEntry(rawInput) {
  const { chatId, sendMessage } = getContext();
  console.log(`Creating budget entry with input: ${rawInput}`);
  let data;
  try {
    data = await parseBudgetInput(rawInput);
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
    console.error(`Error creating budget entry: ${error.message}`);
    await sendMessage(chatId, `Error creating budget entry: ${error.message}`);
    return {
      success: false,
      message: `Error creating budget entry: ${error.message}`,
    };
  }
  if (data) {
    await sendMessage(
      chatId,
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
    await sendMessage(chatId, "Error: No data returned from parseBudgetInput.");
    return {
      success: false,
      message: "Error: No data returned from parseBudgetInput.",
    };
  }
}

export async function parseBudgetInput(parts) {
  const { chatId, sendMessage } = getContext();
  if (parts.length < 3) {
    await sendMessage(
      chatId,
      "Format: amount category company\nExample: 24.99 groceries walmart"
    );
    return;
  }
  let amount = parts[0];
  if (amount.startsWith("+")) {
    amount = parseFloat(amount.slice(1));
  } else {
    amount = -Math.abs(parseFloat(amount));
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
