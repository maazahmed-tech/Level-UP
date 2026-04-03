import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const measurementId = parseInt(id);
  if (isNaN(measurementId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  // Verify ownership
  const measurement = await prisma.bodyMeasurement.findUnique({
    where: { id: measurementId },
  });

  if (!measurement || measurement.userId !== session.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.bodyMeasurement.delete({
    where: { id: measurementId },
  });

  return NextResponse.json({ success: true });
}
