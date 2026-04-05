import { createOrder } from "@/server/services/razorpay";
import { CreateOrderSchema } from "@/server/services/razorpay/schemas";
import { OrderCreationError } from "@/server/services/razorpay";
import { auth } from "@clerk/nextjs/server";

/**
 * Route Handler for creating a Razorpay order.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let rawBody;
    try {
      rawBody = await req.json();
    } catch (e) {
      return Response.json({ error: "Malformed JSON" }, { status: 400 });
    }

    const body = CreateOrderSchema.safeParse(rawBody);

    if (!body.success) {
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    }

    const order = await createOrder(body.data, userId);
    return Response.json(order, { status: 201 });
  } catch (err) {
    if (err instanceof OrderCreationError) {
      return Response.json({ error: err.message }, { status: err.statusCode });
    }
    console.error("[Create Order Route Error]:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
