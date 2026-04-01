import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Admin GET testimonials error:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      duration,
      quote,
      isFeatured,
      isPublished,
      displayOrder,
      profilePhoto,
      beforePhoto,
      afterPhoto,
    } = body;

    if (!clientName || !clientName.trim()) {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }
    if (!quote || !quote.trim()) {
      return NextResponse.json(
        { error: "Quote is required" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: clientName.trim(),
        duration: duration || "",
        quote: quote.trim(),
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== false,
        displayOrder: Number(displayOrder) || 0,
        profilePhoto: profilePhoto || null,
        beforePhoto: beforePhoto || null,
        afterPhoto: afterPhoto || null,
      },
    });

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    console.error("Admin POST testimonial error:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
