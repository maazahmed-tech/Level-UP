import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const templateId = parseInt(id);

    const days = await prisma.planTemplateDay.findMany({
      where: { templateId },
      include: { workout: { select: { id: true, title: true, slug: true } } },
      orderBy: [{ weekNumber: "asc" }, { dayOfWeek: "asc" }],
    });

    return NextResponse.json(days);
  } catch (error) {
    console.error("Get template days error:", error);
    return NextResponse.json(
      { error: "Failed to fetch template days" },
      { status: 500 }
    );
  }
}

interface DayInput {
  dayOfWeek: number;
  weekNumber: number;
  workoutId?: number | null;
  workoutNotes?: string | null;
  mealPlan?: string | null;
  calorieTarget?: number | null;
  proteinTarget?: number | null;
  carbsTarget?: number | null;
  fatTarget?: number | null;
  notes?: string | null;
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

    const { id } = await params;
    const templateId = parseInt(id);
    const body = await request.json();
    const { days } = body as { days: DayInput[] };

    if (!days || !Array.isArray(days)) {
      return NextResponse.json(
        { error: "days array is required" },
        { status: 400 }
      );
    }

    // Verify template exists
    const template = await prisma.planTemplate.findUnique({
      where: { id: templateId },
    });
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Bulk replace: delete existing, then create new
    await prisma.planTemplateDay.deleteMany({ where: { templateId } });

    const created = await prisma.planTemplateDay.createMany({
      data: days.map((d: DayInput) => ({
        templateId,
        dayOfWeek: d.dayOfWeek,
        weekNumber: d.weekNumber || 1,
        workoutId: d.workoutId || null,
        workoutNotes: d.workoutNotes || null,
        mealPlan: d.mealPlan || null,
        calorieTarget: d.calorieTarget || null,
        proteinTarget: d.proteinTarget || null,
        carbsTarget: d.carbsTarget || null,
        fatTarget: d.fatTarget || null,
        notes: d.notes || null,
      })),
    });

    return NextResponse.json({ success: true, count: created.count });
  } catch (error) {
    console.error("Set template days error:", error);
    return NextResponse.json(
      { error: "Failed to set template days" },
      { status: 500 }
    );
  }
}
