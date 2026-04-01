import { NextResponse } from "next/server";

// In-memory store for demo mode
const subscribers: { email: string; firstName?: string; lastName?: string; date: string }[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Check duplicate
    if (subscribers.some((s) => s.email === email.toLowerCase())) {
      return NextResponse.json(
        { error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    subscribers.push({
      email: email.toLowerCase(),
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      date: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "You've been subscribed successfully!",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
