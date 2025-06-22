let chatId = null as number | null;

export function setChatId(newChatId: number | null) {
  chatId = newChatId;
}

export function getChatId() {
  return chatId;
}
