import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface CustomDay {
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

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, templateId, name, description, type, startDate, customDays } = body;

    if (!userId || !name || !startDate) {
      return NextResponse.json(
        { error: "userId, name, and startDate are required" },
        { status: 400 }
      );
    }

    // Verify user exists
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let daysToCreate: CustomDay[] = [];
    let planType = type || "combined";

    if (templateId) {
      // Copy days from template
      const template = await prisma.planTemplate.findUnique({
        where: { id: parseInt(templateId) },
        include: { days: true },
      });
      if (!template) {
        return NextResponse.json({ error: "Template not found" }, { status: 404 });
      }
      planType = type || template.type;
      daysToCreate = template.days.map((d) => ({
        dayOfWeek: d.dayOfWeek,
        weekNumber: d.weekNumber,
        workoutId: d.workoutId,
        workoutNotes: d.workoutNotes,
        mealPlan: d.mealPlan,
        calorieTarget: d.calorieTarget,
        proteinTarget: d.proteinTarget,
        carbsTarget: d.carbsTarget,
        fatTarget: d.fatTarget,
        notes: d.notes,
      }));
    } else if (customDays && Array.isArray(customDays)) {
      daysToCreate = customDays;
    }

    // Create ClientPlan
    const clientPlan = await prisma.clientPlan.create({
      data: {
        userId,
        templateId: templateId ? parseInt(templateId) : null,
        name,
        description: description || null,
        type: planType,
        startDate: new Date(startDate),
        status: "active",
      },
    });

    // Create ClientPlanDays
    if (daysToCreate.length > 0) {
      await prisma.clientPlanDay.createMany({
        data: daysToCreate.map((d: CustomDay) => ({
          clientPlanId: clientPlan.id,
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
    }

    // Update user.activePlanId
    await prisma.user.update({
      where: { id: userId },
      data: { activePlanId: clientPlan.id },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: "New Plan Assigned",
        message: `Coach assigned you a new plan: ${name}`,
        type: "plan",
        actionUrl: "/hub/my-plan",
      },
    });

    return NextResponse.json(clientPlan);
  } catch (error) {
    console.error("Assign plan error:", error);
    return NextResponse.json(
      { error: "Failed to assign plan" },
      { status: 500 }
    );
  }
}
