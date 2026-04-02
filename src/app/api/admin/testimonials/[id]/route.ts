import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonial = await prisma.testimonial.findUnique({
      where: { id: Number(id) },
    });
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Admin GET testimonial error:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const testimonial = await prisma.testimonial.update({
      where: { id: Number(id) },
      data: {
        ...(clientName !== undefined && { clientName: clientName.trim() }),
        ...(duration !== undefined && { duration }),
        ...(quote !== undefined && { quote: quote.trim() }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isPublished !== undefined && { isPublished: Boolean(isPublished) }),
        ...(displayOrder !== undefined && { displayOrder: Number(displayOrder) }),
        ...(profilePhoto !== undefined && { profilePhoto }),
        ...(beforePhoto !== undefined && { beforePhoto }),
        ...(afterPhoto !== undefined && { afterPhoto }),
      },
    });

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("Admin PUT testimonial error:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
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
    await prisma.testimonial.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin DELETE testimonial error:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
