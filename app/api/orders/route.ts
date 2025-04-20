import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { buyerName, buyerContact, deliveryAddress, items, status } =
      await req.json();

    if (!buyerName || !buyerContact || !deliveryAddress || !items) {
      return NextResponse.json(
        { error: "Buyer details and items are required" },
        { status: 400 }
      );
    }

    const validItems = [];

    for (const item of items) {
      const { productId, quantity } = item;
      const product = await Product.findById(productId);

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

    const order = await Order.create({
      buyerName,
      buyerContact,
      deliveryAddress,
      items: validItems,
      status: status || "pending",
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

export async function GET() {
  await dbConnect();

  try {
    const orders = await Order.find();

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
