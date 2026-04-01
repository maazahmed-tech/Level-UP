import { NextResponse } from "next/server";
import { getCurrentUser, clearSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Soft delete: set isActive to false
  await prisma.user.update({
    where: { id: session.userId },
    data: { isActive: false },
  });

  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
