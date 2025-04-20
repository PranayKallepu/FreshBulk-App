import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { buyerName, buyerContact, deliveryAddress, items, status } =
      await req.json();

    // Validate data
    if (!buyerName || !buyerContact || !deliveryAddress || !items) {
      return NextResponse.json(
        { error: "Buyer details and items are required" },
        { status: 400 }
      );
    }

    // Validate items (must be an array with valid product IDs)
    const validItems = [];
    for (const item of items) {
      const { productId, quantity } = item;
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product with ID ${productId} does not exist` },
          { status: 400 }
        );
      }

      validItems.push({
        productId,
        name: product.name,
        quantity,
        totalPrice: product.price * quantity,
      });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        buyerName,
        buyerContact,
        deliveryAddress,
        items: validItems, // Stored as JSON in DB
        status: status || "pending",
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// GET /api/orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany();
    if (orders.length === 0) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
