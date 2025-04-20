import mongoose, { Schema, Document } from "mongoose";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  totalPrice: number;
}

export interface IOrder extends Document {
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
  items: OrderItem[];
  status: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  buyerName: { type: String, required: true },
  buyerContact: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  items: { type: [Object], required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
