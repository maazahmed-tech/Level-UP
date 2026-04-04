import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    const { searchParams } = new URL(request.url);
    const weekStartDate = searchParams.get("weekStartDate");

    const where: { userId: string; weekStartDate?: Date } = { userId };
    if (weekStartDate) {
      where.weekStartDate = new Date(weekStartDate);
    }

    const targets = await prisma.weeklyTarget.findMany({
      where,
      orderBy: [{ weekStartDate: "desc" }, { metric: "asc" }],
    });

    return NextResponse.json(targets);
  } catch (error) {
    console.error("Get weekly targets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weekly targets" },
      { status: 500 }
    );
  }
}

interface TargetInput {
  metric: string;
  targetValue: number;
  isVisible?: boolean;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    const body = await request.json();
    const { weekStartDate, targets } = body as {
      weekStartDate: string;
      targets: TargetInput[];
    };

    if (!weekStartDate || !targets || !Array.isArray(targets)) {
      return NextResponse.json(
        { error: "weekStartDate and targets array are required" },
        { status: 400 }
      );
    }

    // Verify user exists
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const created = [];
    for (const t of targets) {
      // Upsert: delete existing for same metric+week, then create
      await prisma.weeklyTarget.deleteMany({
        where: {
          userId,
          weekStartDate: new Date(weekStartDate),
          metric: t.metric,
        },
      });

      const target = await prisma.weeklyTarget.create({
        data: {
          userId,
          weekStartDate: new Date(weekStartDate),
          metric: t.metric,
          targetValue: parseFloat(String(t.targetValue)),
          isVisible: t.isVisible !== false,
        },
      });
      created.push(target);

      // Create notification for each target
      await prisma.notification.create({
        data: {
          userId,
          title: "New Weekly Target",
          message: `New weekly target: ${t.metric} \u2192 ${t.targetValue}`,
          type: "target",
          actionUrl: "/hub/my-plan",
        },
      });
    }

    return NextResponse.json(created);
  } catch (error) {
    console.error("Set weekly targets error:", error);
    return NextResponse.json(
      { error: "Failed to set weekly targets" },
      { status: 500 }
    );
  }
}
