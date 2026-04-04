import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const templates = await prisma.planTemplate.findMany({
      include: { _count: { select: { days: true } } },
      orderBy: { createdAt: "desc" },
    });

    const result = templates.map(
      (t: {
        id: number;
        name: string;
        description: string | null;
        type: string;
        durationWeeks: number;
        createdAt: Date;
        updatedAt: Date;
        _count: { days: number };
      }) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        type: t.type,
        durationWeeks: t.durationWeeks,
        dayCount: t._count.days,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get plan templates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch plan templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, type, durationWeeks } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const template = await prisma.planTemplate.create({
      data: {
        name,
        description: description || null,
        type: type || "combined",
        durationWeeks: parseInt(durationWeeks) || 4,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error("Create plan template error:", error);
    return NextResponse.json(
      { error: "Failed to create plan template" },
      { status: 500 }
    );
  }
}
