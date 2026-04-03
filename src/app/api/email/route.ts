/**
 * API route for triggering email notifications via POST requests.
 */
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

// Handle POST requests to /api/email with structured JSON payloads
export async function POST(req: Request) {
  let body: any = "unparsed";
  try {
    // 1. Enforce Authentication
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { error: "UNAUTHORIZED: Authentication required" },
        { status: 401 },
      );
    }

    // 2. Parse and Validate Payload
    body = await req.json();

    // Basic structural validation to catch common mistakes early
    if (!body?.to || !body?.type || !body?.name) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD: Missing required fields (to, type, name)" },
        { status: 400 },
      );
    }

    // 3. Trigger Email Send
    await sendEmail(body);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal Server Error";

    // Improved logging: Ensure actual payload is logged if parsing succeeded
    console.error(
      `[API_EMAIL_ERROR] Payload: ${JSON.stringify(body)}, Error: ${message}`,
    );

    return NextResponse.json(
      { error: "EMAIL_SERVICE_FAILURE", details: message },
      { status: 500 },
    );
  }
}
