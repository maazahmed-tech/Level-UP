import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { planStatus, isActive, role, plan } = body;

    const data: Record<string, unknown> = {};
    if (planStatus !== undefined) data.planStatus = planStatus;
    if (isActive !== undefined) data.isActive = Boolean(isActive);
    if (role !== undefined) data.role = role;
    if (plan !== undefined) data.plan = plan;

    // Health profile fields
    if (body.age !== undefined) data.age = body.age ? parseInt(body.age) : null;
    if (body.gender !== undefined) data.gender = body.gender;
    if (body.heightCm !== undefined) data.heightCm = body.heightCm ? parseFloat(body.heightCm) : null;
    if (body.currentWeightKg !== undefined) data.currentWeightKg = body.currentWeightKg ? parseFloat(body.currentWeightKg) : null;
    if (body.bodyFatPercent !== undefined) data.bodyFatPercent = body.bodyFatPercent ? parseFloat(body.bodyFatPercent) : null;
    if (body.fitnessGoal !== undefined) data.fitnessGoal = body.fitnessGoal;
    if (body.activityLevel !== undefined) data.activityLevel = body.activityLevel;
    if (body.dietaryPrefs !== undefined) data.dietaryPrefs = body.dietaryPrefs;
    if (body.targetWeightKg !== undefined) data.targetWeightKg = body.targetWeightKg ? parseFloat(body.targetWeightKg) : null;
    if (body.activePlanId !== undefined) data.activePlanId = body.activePlanId;

    const user = await prisma.user.update({ where: { id }, data });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Admin PUT user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
