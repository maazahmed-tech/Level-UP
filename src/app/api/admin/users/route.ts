import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        country: true,
        role: true,
        isActive: true,
        plan: true,
        planStatus: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin GET users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
