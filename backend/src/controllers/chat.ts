import { Request, Response } from "express";
import { chatService } from "../services/chatService";

/**
 * GET /chat/conversations
 */
export async function getConversations(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const conversations = await chatService.getConversations(userId);
  res.json({ data: conversations });
}

/**
 * GET /chat/messages/:conversationId
 */
export async function getMessages(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { conversationId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;

  const messages = await chatService.getMessages(conversationId, userId, page, limit);
  res.json({ data: messages });
}

/**
 * POST /chat/conversations
 * Body: { otherUserId: string }
 */
export async function startConversation(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const { otherUserId } = req.body;

  if (!otherUserId) {
    return res.status(400).json({ error: "otherUserId is required" });
  }

  const conversation = await chatService.startConversation(userId, otherUserId);
  res.json({ data: conversation });
}
