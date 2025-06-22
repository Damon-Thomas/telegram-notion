import { ParsedTaskInput } from "@/definitions/types";

export function parseDateShortcut(input: string): string {
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

function normalizeFrequency(input: string): string {
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

export function parseTaskInput(raw: string[]): ParsedTaskInput {
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
