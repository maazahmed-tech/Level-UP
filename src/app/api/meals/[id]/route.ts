import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const meal = await prisma.mealLog.findUnique({ where: { id: parseInt(id) } });

    if (!meal) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    if (meal.userId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.mealLog.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Meal DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete meal" }, { status: 500 });
  }
}
