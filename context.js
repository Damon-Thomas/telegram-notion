let chatId = null;
let sendMessage = null;

export function setContext(newChatId, newSendTelegramMessage) {
  chatId = newChatId;
  sendMessage = newSendTelegramMessage;
}

export function getContext() {
  return { chatId, sendMessage };
}
