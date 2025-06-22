import { notion } from "@/index";
import { sendTelegramMessage } from "@utils/telegramMessage";
import { parseTaskInput } from "@utils/textParser";

export async function createTaskEntry(rawInput: string[]) {
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
    const taskDbId = process.env.NOTION_TASK_DB_ID;
    console.log("taskDbId", taskDbId); // Add this after the const
    await notion.pages.create({
      parent: { database_id: taskDbId || "" },
      properties: {
        Task: {
          title: [{ text: { content: data.Name } }],
        },
        Status: {
          select: { name: "To Do" },
        },
        Type: {
          select: { name: data.Tag },
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
    if (error instanceof Error) {
      console.error(`Error creating task: ${error.message}`);
      await sendTelegramMessage(`Error creating task: ${error.message}`);
      return {
        success: false,
        message: `Error creating task: ${error.message}`,
      };
    }
    console.error("Unknown error creating task:", error);
    await sendTelegramMessage(
      `Error creating task due to an unknown error. Please check the logs.`
    );
    return {
      success: false,
      message: `Error creating task due to an unknown error. Please check the logs.`,
    };
  }

  if (data) {
    await sendTelegramMessage(
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
    await sendTelegramMessage("Error: No data returned from parseTaskInput.");
    return {
      success: false,
      message: "Error: No data returned from parseTaskInput.",
    };
  }
}
