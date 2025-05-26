import { getContext } from "./context.js";
import { notion } from "./index.js";
// import { capitalizeFirst } from "./utils.js";

const taskDbId = process.env.NOTION_TASK_DB_ID;
console.log("taskDbId", taskDbId); // Add this after the const
export async function createTaskEntry(rawInput) {
  const { chatId, sendMessage } = getContext();
  console.log(`Creating task with input: ${rawInput}`);
  let data;
  try {
    data = parseTaskInput(rawInput);
    console.log(`Parse task input end`);
    console.log(
      `Parsed data:
Task = ${data.Name}
Type = ${data.Tag}
Priority = ${data.Priority}
Due = ${data.Date}
Frequency = ${data.Frequency}
Notes = ${data.Notes}`
    );
    console.log("hdshisdhi", taskDbId);
    await notion.pages.create({
      parent: { database_id: taskDbId },
      properties: {
        Task: {
          title: [{ text: { content: data.Name } }],
        },
        Status: {
          select: { name: "To Do" },
        },
        Type: {
          select: [{ name: data.Tag }],
        },
        Due: {
          date: { start: data.Date },
        },
        Frequency: {
          select: { name: data.Frequency || "None" },
        },
        Priority: {
          select: { name: data.Priority || "Low" },
        },
        Notes: {
          rich_text: [{ text: { content: data.Notes || "" } }],
        },
      },
    });
  } catch (error) {
    console.error(`Error creating task: ${error.message}`);
    await sendMessage(chatId, `Error creating task: ${error.message}`);
    return {
      success: false,
      message: `Error creating task: ${error.message}`,
    };
  }

  if (data) {
    await sendMessage(
      chatId,
      `✅ Task created successfully!
------------------------------------------------------
📝 Task: ${data.Name}
📌 Type: ${data.Tag}
⚡ Priority: ${data.Priority || "Low"}
📅 Due: ${data.Date || "Not set"}
🔁 Frequency: ${data.Frequency || "None"}
🗒️ Notes: ${data.Notes || "None"}`
    );
    return {
      success: true,
      message: "Task created successfully!",
    };
  } else {
    await sendMessage(chatId, "Error: No data returned from parseTaskInput.");
    return {
      success: false,
      message: "Error: No data returned from parseTaskInput.",
    };
  }
}

// export async function createTaskEntry(rawInput) {
//   const data = parseTaskInput(rawInput);

//   try {
//     await notion.pages.create({
//       parent: { database_id: taskDbId },
//       properties: {
//         Task: {
//           title: [{ text: { content: data.Name } }],
//         },
//         Status: {
//           select: { name: "To Do" },
//         },
//         Type: {
//           select: [{ name: data.Tag }],
//         },
//         Due: {
//           date: { start: data.Date },
//         },
//         Frequency: {
//           select: { name: data.Frequency || "None" },
//         },
//         Priority: {
//           select: { name: data.Priority || "Low" },
//         },
//         Notes: {
//           rich_text: [{ text: { content: data.Notes || "" } }],
//         },
//       },
//     });
//   } catch (error) {
//     console.error(`Error creating budget entry: ${error.message}`);
//     await sendMessage(chatId, `Error creating budget entry: ${error.message}`);
//     return {
//       success: false,
//       message: `Error creating budget entry: ${error.message}`,
//     };
//   }
// }

function parseDateShortcut(input) {
  const today = new Date();
  const match1 = input.match(/^(\d{1,2})([a-zA-Z]{3,})$/); // e.g., 8Apr
  const match2 = input.match(/^([a-zA-Z]{3,})(\d{1,2})$/); // e.g., Apr8

  if (match1) {
    const [_, day, month] = match1;
    return new Date(`${month} ${day}, ${today.getFullYear()}`)
      .toISOString()
      .split("T")[0];
  }

  if (match2) {
    const [_, month, day] = match2;
    return new Date(`${month} ${day}, ${today.getFullYear()}`)
      .toISOString()
      .split("T")[0];
  }

  return today.toISOString().split("T")[0];
}

function parseTaskInput(raw) {
  console.log(`Parse task input start`);
  console.log(`Parsing task input: ${raw}`);
  let parts = raw;
  let taskName = raw[0];
  console.log(`Raw input: ${raw} task: ${taskName}`);
  let type = "general";
  let priority = "Low";
  let date = "";
  let frequency = "None";
  let notes = "";

  for (let part of parts) {
    // if (part.startsWith("t")) {
    //   taskName = part.slice(2).trim();
    if (part.startsWith("n ")) {
      notes = part.slice(2).trim();
    } else if (part.startsWith("-")) {
      notes = part.slice(1).trim();
    } else if (
      ["chore", "habit", "home", "project"].includes(part.toLowerCase())
    ) {
      type = part.toLowerCase();
    } else if (part.toLowerCase() === "c") {
      type = "chore";
    } else if (part.toLowerCase() === "h") {
      priority = "High";
    } else if (part.toLowerCase() === "m") {
      priority = "Medium";
    } else if (part.toLowerCase() === "l") {
      priority = "Low";
    } else if (part.toLowerCase().startsWith("p ")) {
      const p = part.split(" ")[1]?.toLowerCase();
      if (p === "high") priority = "High";
      else if (p === "medium") priority = "Medium";
      else if (p === "low") priority = "Low";
    } else if (part.toLowerCase().startsWith("d ")) {
      date = parseDateShortcut(part.split(" ")[1]);
    } else if (/^[a-zA-Z]{3,}[0-9]{1,2}$|^[0-9]{1,2}[a-zA-Z]{3,}$/.test(part)) {
      date = parseDateShortcut(part);
    } else if (part.toLowerCase().startsWith("f ")) {
      frequency = normalizeFrequency(part.slice(2).trim());
    } else if (
      /^\d+$/.test(part.trim()) ||
      ["daily", "weekly", "monthly", "quarterly", "annually", "none"].includes(
        part.toLowerCase()
      )
    ) {
      frequency = normalizeFrequency(part.trim());
    }
  }

  return {
    Name: taskName,
    Tag: type,
    Priority: priority,
    Date: date,
    Frequency: frequency,
    Notes: notes,
  };
}

function normalizeFrequency(input) {
  const lower = input.toLowerCase();

  const standard = [
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "annually",
    "none",
  ];
  if (standard.includes(lower)) return lower;

  // If it's a number (positive int), treat as X days
  const asNumber = parseInt(lower, 10);
  if (!isNaN(asNumber) && asNumber > 0) {
    return `${asNumber} days`;
  }

  // Fallback
  return "none";
}
