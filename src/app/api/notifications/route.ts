import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get("count") === "true";

    if (countOnly) {
      const count = await prisma.notification.count({
        where: { userId: user.userId, isRead: false },
      });
      return NextResponse.json({ count });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body.all) {
      await prisma.notification.updateMany({
        where: { userId: user.userId, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (body.ids && Array.isArray(body.ids)) {
      await prisma.notification.updateMany({
        where: {
          id: { in: body.ids },
          userId: user.userId,
        },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Notifications PUT error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
