import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, logoUrl, introduction, tips, menuItems, isPublished } =
      body;

    const restaurant = await prisma.restaurantGuide.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(slug !== undefined && { slug }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(introduction !== undefined && { introduction: introduction.trim() }),
        ...(tips !== undefined && { tips }),
        ...(menuItems !== undefined && {
          menuItems:
            typeof menuItems === "string"
              ? menuItems
              : JSON.stringify(menuItems),
        }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
      },
    });

    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error("Admin PUT restaurant error:", error);
    return NextResponse.json(
      { error: "Failed to update restaurant" },
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
    await prisma.restaurantGuide.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE restaurant error:", error);
    return NextResponse.json(
      { error: "Failed to delete restaurant" },
      { status: 500 }
    );
  }
}
