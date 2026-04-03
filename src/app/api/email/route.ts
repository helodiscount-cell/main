/**
 * API route for triggering email notifications via POST requests.
 */
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { EmailPayload } from "@/lib/email/types";

// Handle POST requests to /api/email with structured JSON payloads
export async function POST(req: Request) {
  try {
    // Validate that the request body is valid JSON matching EmailPayload
    const body: EmailPayload = await req.json();

    // Basic structural validation to catch common mistakes early
    if (!body?.to || !body?.type || !body?.name) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD: Missing required fields (to, type, name)" },
        { status: 400 },
      );
    }

    // Call the isolated email service to render and send
    await sendEmail(body);

    // Return success response on successful delivery
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    // Standardized error reporting with context for the caller
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    console.error(
      `[API_EMAIL_ERROR] Payload: ${req.body?.toString()}, Error: ${message}`,
    );

    return NextResponse.json(
      { error: "EMAIL_SERVICE_FAILURE", details: message },
      { status: 500 },
    );
  }
}
