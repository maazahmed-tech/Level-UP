import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  const logs = await prisma.stepLog.findMany({
    where: {
      userId: session.userId,
      loggedDate: { gte: cutoff },
    },
    orderBy: { loggedDate: "desc" },
  });

  return NextResponse.json({ logs });
}

export async function POST(request: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { steps, goal, loggedDate } = body;

  if (!steps || typeof steps !== "number" || steps < 0) {
    return NextResponse.json({ error: "Invalid steps value" }, { status: 400 });
  }

  const date = loggedDate
    ? new Date(loggedDate + "T00:00:00.000Z")
    : new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z");

  const log = await prisma.stepLog.upsert({
    where: {
      userId_loggedDate: {
        userId: session.userId,
        loggedDate: date,
      },
    },
    update: {
      steps,
      ...(goal !== undefined && { goal }),
    },
    create: {
      userId: session.userId,
      steps,
      goal: goal || 10000,
      loggedDate: date,
    },
  });

  return NextResponse.json({ log });
}

export async function DELETE(request: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { loggedDate } = body;

  if (!loggedDate) {
    return NextResponse.json({ error: "loggedDate required" }, { status: 400 });
  }

  const date = new Date(loggedDate + "T00:00:00.000Z");

  await prisma.stepLog.deleteMany({
    where: {
      userId: session.userId,
      loggedDate: date,
    },
  });

  return NextResponse.json({ success: true });
}
