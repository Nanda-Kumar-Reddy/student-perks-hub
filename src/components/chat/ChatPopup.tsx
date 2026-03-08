import { useState, useRef, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { X, Send, MessageCircle, ArrowLeft, Paperclip, Search, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ── Demo data for UI preview ──
const demoConversations = [
  {
    id: "demo-1",
    otherUser: { id: "u1", fullName: "Sarah Mitchell", avatarUrl: null },
    lastMessage: { text: "Great! Please come at 9 AM sharp.", senderId: "u1", createdAt: new Date(Date.now() - 3600000).toISOString() },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "demo-2",
    otherUser: { id: "u2", fullName: "James Cooper", avatarUrl: null },
    lastMessage: { text: "Thanks for applying to the task!", senderId: "u2", createdAt: new Date(Date.now() - 86400000).toISOString() },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "demo-3",
    otherUser: { id: "u3", fullName: "Emily Chen", avatarUrl: null },
    lastMessage: { text: "Is the accommodation still available?", senderId: "me", createdAt: new Date(Date.now() - 172800000).toISOString() },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "demo-4",
    otherUser: { id: "u4", fullName: "DriveRight School", avatarUrl: null },
    lastMessage: { text: "Your lesson is confirmed for Friday.", senderId: "u4", createdAt: new Date(Date.now() - 259200000).toISOString() },
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

const demoMessages: Record<string, Array<{ id: string; conversationId: string; senderId: string; senderName: string; messageText: string; createdAt: string; isRead: boolean }>> = {
  "demo-1": [
    { id: "m1", conversationId: "demo-1", senderId: "u1", senderName: "Sarah Mitchell", messageText: "Hi! Are you interested in the garden maintenance task?", createdAt: new Date(Date.now() - 7200000).toISOString(), isRead: true },
    { id: "m2", conversationId: "demo-1", senderId: "me", senderName: "You", messageText: "Yes, I have experience with gardening. When should I arrive?", createdAt: new Date(Date.now() - 5400000).toISOString(), isRead: true },
    { id: "m3", conversationId: "demo-1", senderId: "u1", senderName: "Sarah Mitchell", messageText: "Great! Please come at 9 AM sharp. I'll have everything ready.", createdAt: new Date(Date.now() - 3600000).toISOString(), isRead: false },
    { id: "m4", conversationId: "demo-1", senderId: "u1", senderName: "Sarah Mitchell", messageText: "Also, please bring gloves if you have them!", createdAt: new Date(Date.now() - 3500000).toISOString(), isRead: false },
  ],
  "demo-2": [
    { id: "m5", conversationId: "demo-2", senderId: "u2", senderName: "James Cooper", messageText: "Thanks for applying to the task!", createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true },
    { id: "m6", conversationId: "demo-2", senderId: "me", senderName: "You", messageText: "Thank you! I'm looking forward to it.", createdAt: new Date(Date.now() - 82800000).toISOString(), isRead: true },
  ],
  "demo-3": [
    { id: "m7", conversationId: "demo-3", senderId: "me", senderName: "You", messageText: "Hi Emily! Is the accommodation near the university?", createdAt: new Date(Date.now() - 259200000).toISOString(), isRead: true },
    { id: "m8", conversationId: "demo-3", senderId: "u3", senderName: "Emily Chen", messageText: "Yes, it's a 10-minute walk from campus!", createdAt: new Date(Date.now() - 216000000).toISOString(), isRead: true },
    { id: "m9", conversationId: "demo-3", senderId: "me", senderName: "You", messageText: "Is the accommodation still available?", createdAt: new Date(Date.now() - 172800000).toISOString(), isRead: true },
  ],
  "demo-4": [
    { id: "m10", conversationId: "demo-4", senderId: "u4", senderName: "DriveRight School", messageText: "Your lesson is confirmed for Friday.", createdAt: new Date(Date.now() - 259200000).toISOString(), isRead: false },
  ],
};

export default function ChatPopup() {
  const { user } = useAuth();
  const { chatOpen, setChatOpen, conversations: liveConversations, activeConversationId, setActiveConversationId, messages: liveMessages, sendMessage, unreadTotal, onlineUsers, isConnected } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showConvoList, setShowConvoList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use demo data when not connected to realtime
  const conversations = isConnected && liveConversations.length > 0 ? liveConversations : demoConversations;
  const currentMessages = activeConversationId
    ? isConnected && liveMessages.length > 0
      ? liveMessages
      : demoMessages[activeConversationId] ?? []
    : [];

  const activeConvo = conversations.find((c) => c.id === activeConversationId);

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = isConnected ? unreadTotal : demoConversations.reduce((s, c) => s + c.unreadCount, 0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    if (isConnected) {
      sendMessage(newMessage);
    }
    setNewMessage("");
  };

  const handleSelectConvo = (id: string) => {
    setActiveConversationId(id);
    setShowConvoList(false);
  };

  const handleBack = () => {
    setActiveConversationId(null);
    setShowConvoList(true);
  };

  const currentUserId = user?.id ?? "me";

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setChatOpen(true)}
            className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
          >
            <MessageCircle className="h-6 w-6" />
            {totalUnread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl",
              // Desktop
              "bottom-6 right-6 h-[520px] w-[420px]",
              // Mobile override
              "max-sm:inset-2 max-sm:bottom-2 max-sm:right-2 max-sm:left-2 max-sm:top-auto max-sm:h-[calc(100vh-80px)] max-sm:w-auto max-sm:rounded-xl"
            )}
          >
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-border bg-primary px-4">
              <div className="flex items-center gap-2">
                {!showConvoList && activeConvo && (
                  <button onClick={handleBack} className="mr-1 rounded-lg p-1 text-primary-foreground/70 hover:text-primary-foreground sm:hidden">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                )}
                <MessageCircle className="h-5 w-5 text-primary-foreground" />
                <span className="font-display text-sm font-bold text-primary-foreground">
                  {!showConvoList && activeConvo ? activeConvo.otherUser.fullName : "Messages"}
                </span>
                {!showConvoList && activeConvo && onlineUsers.includes(activeConvo.otherUser.id) && (
                  <Circle className="h-2.5 w-2.5 fill-[hsl(var(--success))] text-[hsl(var(--success))]" />
                )}
              </div>
              <button onClick={() => setChatOpen(false)} className="rounded-lg p-1.5 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left Panel — Conversation List */}
              <div
                className={cn(
                  "flex flex-col border-r border-border bg-card",
                  // On mobile: full width when showing, hidden when chatting
                  showConvoList ? "w-full sm:w-[180px]" : "hidden sm:flex sm:w-[180px]"
                )}
              >
                {/* Search */}
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                </div>

                {/* Conversation list */}
                <ScrollArea className="flex-1">
                  <div className="space-y-0.5 p-1">
                    {filteredConversations.map((convo) => (
                      <button
                        key={convo.id}
                        onClick={() => handleSelectConvo(convo.id)}
                        className={cn(
                          "flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                          activeConversationId === convo.id
                            ? "bg-primary/10"
                            : "hover:bg-secondary"
                        )}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {convo.otherUser.fullName.charAt(0).toUpperCase()}
                          </div>
                          {onlineUsers.includes(convo.otherUser.id) && (
                            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold truncate">{convo.otherUser.fullName}</span>
                            {convo.lastMessage && (
                              <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-1">
                                {formatTime(convo.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-[11px] text-muted-foreground truncate max-w-[100px]">
                              {convo.lastMessage?.text ?? "No messages yet"}
                            </p>
                            {convo.unreadCount > 0 && (
                              <Badge className="h-4 min-w-[16px] px-1 text-[9px] bg-primary text-primary-foreground flex-shrink-0">
                                {convo.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                    {filteredConversations.length === 0 && (
                      <p className="py-8 text-center text-xs text-muted-foreground">No conversations</p>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Right Panel — Chat Messages */}
              <div
                className={cn(
                  "flex flex-1 flex-col",
                  !showConvoList ? "flex" : "hidden sm:flex"
                )}
              >
                {activeConvo ? (
                  <>
                    {/* Messages */}
                    <ScrollArea className="flex-1 p-3">
                      <div className="space-y-2">
                        {currentMessages.map((msg) => {
                          const isMine = msg.senderId === currentUserId || msg.senderId === "me";
                          return (
                            <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                              <div
                                className={cn(
                                  "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                                  isMine
                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                                )}
                              >
                                <p className="break-words">{msg.messageText}</p>
                                <p className={cn("text-[10px] mt-0.5", isMine ? "text-primary-foreground/60" : "text-muted-foreground")}>
                                  {formatTime(msg.createdAt)}
                                  {isMine && msg.isRead && " ✓✓"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Input */}
                    <div className="border-t border-border p-2">
                      <div className="flex items-center gap-1.5">
                        <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary transition-colors" title="Attach file (coming soon)">
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                          className="h-9 text-sm"
                        />
                        <Button size="icon" className="h-9 w-9 flex-shrink-0" onClick={handleSend} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-display text-sm font-bold">Your Messages</h3>
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                      Select a conversation to start chatting
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
