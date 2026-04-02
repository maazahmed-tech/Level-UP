import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        likes: true,
        comments: true,
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = posts.map((post) => ({
      id: post.id,
      content: post.content,
      mediaType: post.mediaType,
      mediaUrl: post.mediaUrl,
      createdAt: post.createdAt.toISOString(),
      author: {
        id: post.author.id,
        firstName: post.author.firstName,
        lastName: post.author.lastName,
        role: post.author.role,
      },
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      likedByMe: user
        ? post.likes.some((like) => like.userId === user.userId)
        : false,
    }));

    return NextResponse.json({ posts: formatted });
  } catch (error) {
    console.error("Feed GET error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, mediaType, mediaUrl } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        authorId: user.userId,
        content: content.trim(),
        mediaType: mediaType || null,
        mediaUrl: mediaUrl || null,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json({
      post: {
        id: post.id,
        content: post.content,
        mediaType: post.mediaType,
        mediaUrl: post.mediaUrl,
        createdAt: post.createdAt.toISOString(),
        author: post.author,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        likedByMe: false,
      },
    });
  } catch (error) {
    console.error("Feed POST error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
