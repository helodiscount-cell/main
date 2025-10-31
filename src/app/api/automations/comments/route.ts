import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { BeErrorResponse } from "@/types";
import { AutoReplyCommentsSchema } from "@/types/zod";

export async function POST(request: Request) {
  // Authenticates the user
  const { userId: clerkId } = await auth();

  // Returns unauthorized if not authenticated
  if (!clerkId) {
    const res: BeErrorResponse = {
      success: false,
      error: "Unauthorized. Please sign in.",
      details: "",
    };
    return NextResponse.json(res, { status: 401 });
  }

  try {
    // Parses the JSON request body
    const body = await request.json();

    // Validates the request with zod schema
    const parseResult = AutoReplyCommentsSchema.safeParse(body);

    // Returns error if validation fails
    if (!parseResult.success) {
      // Sends error if validation fails
      const error: BeErrorResponse = {
        success: false,
        error: "Invalid request body. Please retry.",
        details: "some field is missing or invalid",
      };
      return NextResponse.json(error, { status: 400 });
    }

    // TODO: Save the automation config to DB (not implemented)
    // Responds with success and echoes parsed data
    return NextResponse.json(
      {
        success: true,
        message: "Automation config received. (Persistence not implemented)",
        data: parseResult.data,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handles any unexpected server errors
    const serverError: BeErrorResponse = {
      success: false,
      error:
        "Unexpected server error occurred while processing your request. Please try again.",
      details: error instanceof Error ? error.message : "",
    };
    return NextResponse.json(serverError, { status: 500 });
  }
}
