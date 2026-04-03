import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(request: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await request.json();

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(body.firstName && { firstName: body.firstName }),
      ...(body.lastName && { lastName: body.lastName }),
      ...(body.country !== undefined && { country: body.country }),
      ...(body.unitPreference && { unitPreference: body.unitPreference }),
      ...(body.age !== undefined && { age: body.age }),
      ...(body.gender !== undefined && { gender: body.gender }),
      ...(body.heightCm !== undefined && { heightCm: body.heightCm }),
      ...(body.currentWeightKg !== undefined && { currentWeightKg: body.currentWeightKg }),
      ...(body.bodyFatPercent !== undefined && { bodyFatPercent: body.bodyFatPercent }),
      ...(body.fitnessGoal !== undefined && { fitnessGoal: body.fitnessGoal }),
      ...(body.activityLevel !== undefined && { activityLevel: body.activityLevel }),
      ...(body.dietaryPrefs !== undefined && { dietaryPrefs: body.dietaryPrefs }),
      ...(body.healthConditions !== undefined && { healthConditions: body.healthConditions }),
      ...(body.targetWeightKg !== undefined && { targetWeightKg: body.targetWeightKg }),
    },
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      country: updated.country,
      unitPreference: updated.unitPreference,
      age: updated.age,
      gender: updated.gender,
      heightCm: updated.heightCm,
      currentWeightKg: updated.currentWeightKg,
      bodyFatPercent: updated.bodyFatPercent,
      fitnessGoal: updated.fitnessGoal,
      activityLevel: updated.activityLevel,
      dietaryPrefs: updated.dietaryPrefs,
      healthConditions: updated.healthConditions,
      targetWeightKg: updated.targetWeightKg,
    },
  });
}
