import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Update product /api/products/:productId
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const id = parseInt(productId);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const body = await req.json();
  const { name, price } = body;

  if (!name || !price) {
    return NextResponse.json(
      { error: "Missing name or price" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { name, price: parseFloat(price) },
    });

    return NextResponse.json({ updated, message: "Product updated" });
  } catch (error) {
    console.error("Product UPDATE FAILED:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// Delete product /api/products/:productId
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const id = parseInt(productId);

  if (!id) {
    return NextResponse.json(
      { error: "Missing product productId" },
      { status: 400 }
    );
  }

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid productId" }, { status: 400 });
  }

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
