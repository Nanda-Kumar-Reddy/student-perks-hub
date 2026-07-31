import { request } from "./client";
import { buildQuery } from "@/utils";
import type { ChatMessage, ConversationItem, PaginatedResponse } from "@/types";

export async function apiGetConversations() {
  return request<{ data: ConversationItem[] }>("GET", "/api/chat/conversations");
}

export async function apiGetChatMessages(conversationId: string, page?: number, limit?: number) {
  return request<{ data: ChatMessage[] }>("GET", `/api/chat/messages/${conversationId}${buildQuery({ page, limit })}`);
}

export async function apiStartConversation(otherUserId: string) {
  return request<{ data: ConversationItem }>("POST", "/api/chat/conversations", { body: { otherUserId } });
}
