import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favourites = await prisma.restaurantFavourite.findMany({
      where: { userId: user.userId },
      select: { restaurantId: true },
    });

    return NextResponse.json(
      favourites.map((f: { restaurantId: number }) => f.restaurantId)
    );
  } catch (error) {
    console.error("Get restaurant favourites error:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurant favourites" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { restaurantId } = body;

    if (!restaurantId) {
      return NextResponse.json(
        { error: "restaurantId is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.restaurantFavourite.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.userId,
          restaurantId: parseInt(restaurantId),
        },
      },
    });

    if (existing) {
      await prisma.restaurantFavourite.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ favourited: false });
    } else {
      await prisma.restaurantFavourite.create({
        data: {
          userId: user.userId,
          restaurantId: parseInt(restaurantId),
        },
      });
      return NextResponse.json({ favourited: true });
    }
  } catch (error) {
    console.error("Toggle restaurant favourite error:", error);
    return NextResponse.json(
      { error: "Failed to toggle restaurant favourite" },
      { status: 500 }
    );
  }
}
