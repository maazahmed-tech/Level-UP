import { NextResponse } from "next/server";

// In-memory store for demo mode
const applications: Record<string, unknown>[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.firstName || !body.lastName || !body.email || !body.age) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const application = {
      id: applications.length + 1,
      ...body,
      status: "PENDING",
      submittedAt: new Date().toISOString(),
    };

    applications.push(application);

    return NextResponse.json({
      success: true,
      message: "Your application has been submitted successfully!",
      applicationId: application.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ applications });
}
