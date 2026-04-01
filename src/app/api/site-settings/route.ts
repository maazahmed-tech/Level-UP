import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.siteContent.findMany();
    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.contentKey] = s.contentValue;
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
