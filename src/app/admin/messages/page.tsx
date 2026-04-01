"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface Conversation {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!selectedUserId) return;
    try {
      const res = await fetch(`/api/messages/${selectedUserId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, [selectedUserId]);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  function selectConversation(userId: string) {
    setSelectedUserId(userId);
    setShowSidebar(false);
    // Clear unread for this conversation locally
    setConversations((prev) =>
      prev.map((c) => (c.userId === userId ? { ...c, unreadCount: 0 } : c))
    );
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUserId,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString("en-IE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatPreviewDate(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    if (diffHrs < 1) return `${Math.floor(diffMs / 60000)}m ago`;
    if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
    return d.toLocaleDateString("en-IE", { day: "numeric", month: "short" });
  }

  const selectedConv = conversations.find((c) => c.userId === selectedUserId);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-sm text-white/50 mt-1">
            {conversations.length} conversation{conversations.length !== 1 && "s"}
            {totalUnread > 0 && (
              <span className="ml-2 text-[#E51A1A] font-semibold">
                ({totalUnread} unread)
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl overflow-hidden flex h-[calc(100vh-200px)] min-h-[500px]">
        {/* Conversations sidebar */}
        <div
          className={`w-full md:w-[320px] border-r border-[#2A2A2A] flex flex-col ${
            !showSidebar && selectedUserId ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="px-4 py-3 border-b border-[#2A2A2A]">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Conversations
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-white/30 text-sm">
                Loading...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-white/30 text-sm">
                No conversations yet.
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => selectConversation(conv.userId)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer border-none ${
                    selectedUserId === conv.userId
                      ? "bg-[#E51A1A]/10"
                      : "bg-transparent hover:bg-white/5"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white/60 font-bold text-xs flex-shrink-0">
                    {conv.firstName[0]}
                    {conv.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white truncate">
                        {conv.firstName} {conv.lastName}
                      </p>
                      <span className="text-[10px] text-white/30 flex-shrink-0 ml-2">
                        {formatPreviewDate(conv.lastMessageDate)}
                      </span>
                    </div>
                    <p className="text-xs text-white/40 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-[#E51A1A] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div
          className={`flex-1 flex flex-col ${
            showSidebar && !selectedUserId ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedUserId && selectedConv ? (
            <>
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-[#2A2A2A] flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden text-white/50 hover:text-white mr-2 bg-transparent border-none cursor-pointer text-lg"
                >
                  &larr;
                </button>
                <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white/60 font-bold text-xs">
                  {selectedConv.firstName[0]}
                  {selectedConv.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {selectedConv.firstName} {selectedConv.lastName}
                  </p>
                  <p className="text-xs text-white/40">User</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isAdmin = msg.sender.role === "ADMIN";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          isAdmin
                            ? "bg-[#E51A1A] text-white"
                            : "bg-[#2A2A2A] text-white"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        <p
                          className={`text-[10px] mt-1.5 ${
                            isAdmin ? "text-white/60" : "text-white/30"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <form
                onSubmit={handleSend}
                className="px-4 py-3 border-t border-[#2A2A2A] flex gap-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E51A1A] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-3 bg-[#E51A1A] text-white rounded-xl text-sm font-semibold hover:bg-[#E51A1A]/90 transition-colors cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? "..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl mb-4">💬</p>
                <p className="text-white/30 text-sm">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
