import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/product";

// PUT /api/products/:productId
export async function PUT(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  await dbConnect();

  const { productId } = params;
  const { name, price } = await req.json();

  if (!name || price === undefined) {
    return NextResponse.json(
      { error: "Missing name or price" },
      { status: 400 }
    );
  }

  try {
    const updated = await Product.findByIdAndUpdate(
      productId,
      { name, price: parseFloat(price) },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ updated, message: "Product updated" });
  } catch (error) {
    console.error("Product UPDATE FAILED:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/:productId
export async function DELETE(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  await dbConnect();

  const { productId } = params;

  try {
    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
