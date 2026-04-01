import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all messages involving the current user
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: user.userId }, { receiverId: user.userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        receiver: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
    });

    // Group messages by the other user's ID
    const conversationMap = new Map<
      string,
      {
        userId: string;
        firstName: string;
        lastName: string;
        role: string;
        lastMessage: string;
        lastMessageDate: string;
        unreadCount: number;
      }
    >();

    for (const msg of messages) {
      const otherUser =
        msg.senderId === user.userId ? msg.receiver : msg.sender;

      // Non-admin users should only see conversations with admin
      if (user.role !== "ADMIN" && otherUser.role !== "ADMIN") {
        continue;
      }

      if (!conversationMap.has(otherUser.id)) {
        conversationMap.set(otherUser.id, {
          userId: otherUser.id,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          role: otherUser.role,
          lastMessage: msg.content,
          lastMessageDate: msg.createdAt.toISOString(),
          unreadCount: 0,
        });
      }

      // Count unread messages sent TO the current user
      if (msg.receiverId === user.userId && !msg.isRead) {
        const conv = conversationMap.get(otherUser.id)!;
        conv.unreadCount++;
      }
    }

    const conversations = Array.from(conversationMap.values()).sort(
      (a, b) =>
        new Date(b.lastMessageDate).getTime() -
        new Date(a.lastMessageDate).getTime()
    );

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content?.trim()) {
      return NextResponse.json(
        { error: "Receiver and content are required" },
        { status: 400 }
      );
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.userId,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        receiver: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
