import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const items = await prisma.foodItem.findMany({
      where: {
        ...(search && { name: { contains: search, mode: "insensitive" as const } }),
        ...(category && { category }),
      },
      take: 50,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Food items search error:", error);
    return NextResponse.json({ error: "Failed to fetch food items" }, { status: 500 });
  }
}
