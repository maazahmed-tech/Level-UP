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

export default function UserMessagesPage() {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("Coach Raheel");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch conversations to find the admin
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        const adminConv = data.conversations?.find(
          (c: Conversation) => c.role === "ADMIN"
        );
        if (adminConv) {
          setAdminId(adminConv.userId);
          setAdminName(`${adminConv.firstName} ${adminConv.lastName}`);
        }
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  }, []);

  // Fetch the admin user directly if no conversation exists yet
  const fetchAdmin = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/admin");
      if (res.ok) {
        const data = await res.json();
        if (data.adminId) {
          setAdminId(data.adminId);
          if (data.adminName) setAdminName(data.adminName);
        }
      }
    } catch {
      // Silently fail — admin endpoint may not exist
    }
  }, []);

  // Fetch messages thread
  const fetchMessages = useCallback(async () => {
    if (!adminId) return;
    try {
      const res = await fetch(`/api/messages/${adminId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        // Determine current user ID from messages
        if (data.messages?.length > 0) {
          const msg = data.messages[0];
          if (msg.sender.role !== "ADMIN") {
            setCurrentUserId(msg.sender.id);
          } else {
            // Find a message from the user
            const userMsg = data.messages.find(
              (m: Message) => m.sender.role !== "ADMIN"
            );
            if (userMsg) setCurrentUserId(userMsg.sender.id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    fetchConversations().then(() => fetchAdmin());
  }, [fetchConversations, fetchAdmin]);

  useEffect(() => {
    if (adminId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [adminId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !adminId || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: adminId, content: newMessage.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        if (!currentUserId && data.message.sender) {
          setCurrentUserId(data.message.sender.id);
        }
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

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>

      <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-240px)] min-h-[500px]">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-[#2A2A2A] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E51A1A]/20 flex items-center justify-center text-[#E51A1A] font-bold text-sm">
            CR
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{adminName}</p>
            <p className="text-xs text-white/40">Your Coach</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/30">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-white/50 text-lg font-medium mb-2">
                  No messages yet
                </p>
                <p className="text-white/30 text-sm max-w-sm">
                  Start a conversation with Coach Raheel. Ask anything about
                  your nutrition, training, or progress.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender.role !== "ADMIN";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      isMe
                        ? "bg-[#E51A1A] text-white"
                        : "bg-[#2A2A2A] text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1.5 ${
                        isMe ? "text-white/60" : "text-white/30"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
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
            placeholder="Type your message..."
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
      </div>
    </div>
  );
}
