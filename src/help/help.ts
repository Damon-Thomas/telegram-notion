import sendBudgetHelpMessage from "./budget/help.js";
import sendDietHelpMessage from "./diet/help.js";
import sendGeneralHelpMessage from "./genHelp.js";
import sendTaskHelpMessage from "./task/help.js";
import sendUnkownHelpMessage from "./unkownHelp.js";

export async function sendHelpMessage(type = "") {
  if (type !== "" && type[0] === "-") {
    type = type.slice(1).trim().toLowerCase();
  }
  console.log(`Processed help message type: ${type}`);
  if (type === "d" || type === "diet") {
    sendDietHelpMessage();
  } else if (type === "b" || type === "budget") {
    sendBudgetHelpMessage();
  } else if (type === "t" || type === "task") {
    sendTaskHelpMessage();
  } else if (type === "") {
    sendGeneralHelpMessage();
  } else {
    sendUnkownHelpMessage();
  }
}
