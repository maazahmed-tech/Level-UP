import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    // Check if already liked
    const existing = await prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId: user.userId },
      },
    });

    if (existing) {
      // Unlike
      await prisma.postLike.delete({ where: { id: existing.id } });
    } else {
      // Like
      await prisma.postLike.create({
        data: { postId, userId: user.userId },
      });
    }

    const count = await prisma.postLike.count({ where: { postId } });

    return NextResponse.json({ liked: !existing, count });
  } catch (error) {
    console.error("Like toggle error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
