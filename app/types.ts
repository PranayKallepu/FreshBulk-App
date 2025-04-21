export interface Product {
  _id: string;
  name: string;
  price: number;
}

export type Props = {
  initialProduct: Product;
  products: Product[];
  onClose: () => void;
};

export interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

// Order Management
export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  productId: number;
  totalPrice: number;
}
export interface Order {
  _id: string;
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
}
