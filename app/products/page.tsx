"use client";

import { fetchProducts } from "@/store/productsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import OrderForm from "@/components/OrderForm";
import Loader from "@/components/Loader";

// Match this with what's returned from MongoDB
export interface Product {
  _id: string;
  name: string;
  price: number;
}

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    items: products,
    loading,
    error,
  } = useSelector((state: RootState) => state.products);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  console.log(selectedProduct);
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleCloseOrderPage = () => {
    setSelectedProduct(null);
  };

  if (loading) return <Loader size={50} color="#16bfd1" />;

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load products. Please try again later.
      </div>
    );

  return (
    <div className="relative w-full min-h-screen pt-20 px-4">
      <h1 className="text-4xl text-center font-bold mb-8">
        Products Catalogue
      </h1>
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
        <div className="max-h-[80vh] overflow-y-auto md:overflow-visible px-4">
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 lg:ml-20 lg:mr-20">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded-2xl p-4 shadow bg-gray-100"
              >
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-green-600 font-bold text-lg">
                  <span className="text-black font-light">Price: </span>₹
                  {product.price.toFixed(2)}/-
                </p>
                <OrderForm
                  initialProduct={product}
                  products={products}
                  onClose={handleCloseOrderPage}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
