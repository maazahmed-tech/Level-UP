import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reminders = await prisma.userReminder.findMany({
      where: { userId: user.userId },
    });

    return NextResponse.json({
      reminders: reminders.map((r) => ({
        type: r.type,
        time: r.time,
        enabled: r.enabled,
      })),
    });
  } catch (error) {
    console.error("Reminders GET error:", error);
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
    const { reminders } = body;

    if (!reminders || !Array.isArray(reminders)) {
      return NextResponse.json(
        { error: "Invalid reminders data" },
        { status: 400 }
      );
    }

    // Upsert each reminder
    for (const rem of reminders) {
      if (!rem.type || !rem.time) continue;

      await prisma.userReminder.upsert({
        where: {
          userId_type: {
            userId: user.userId,
            type: rem.type,
          },
        },
        update: {
          time: rem.time,
          enabled: rem.enabled ?? false,
        },
        create: {
          userId: user.userId,
          type: rem.type,
          time: rem.time,
          enabled: rem.enabled ?? false,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reminders PUT error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
