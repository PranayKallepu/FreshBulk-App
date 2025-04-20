// app/admin/products-manage/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Loader from "@/components/Loader";
import AddProductForm from "@/components/AddProductForm";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
}

const ProductsManage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<boolean>(false);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [editingPrice, setEditingPrice] = useState<string>("");

  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await axios.get<Product[]>("/api/products");
      setProducts(res.data);
      setLoadingError(false);
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error("Error loading products:", error);
      toast.error("Failed to load products.");
      setLoadingError(true);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (product: Product): void => {
    setEditingProductId(product._id);
    setEditingName(product.name);
    setEditingPrice(product.price.toString());
  };

  const cancelEditing = (): void => {
    setEditingProductId(null);
    setEditingName("");
    setEditingPrice("");
  };

  const saveEdit = async (id: string): Promise<void> => {
    if (!editingName.trim() || isNaN(parseInt(editingPrice))) {
      toast.error("Please enter a valid name and price.");
      return;
    }

    setUpdatingProductId(id);
    try {
      await axios.put(`/api/products/${id}`, {
        name: editingName.trim(),
        price: parseInt(editingPrice),
      });
      fetchProducts();
      cancelEditing();
      toast.success("Product updated successfully!");
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error("Error updating product:", error);
      toast.error("Failed to update product.");
    } finally {
      setUpdatingProductId(null);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    setDeletingProductId(id);
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully!");
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <div className="p-6 mt-10 md:px-30">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Products Management
      </h1>

      {loading && (
        <div className="flex justify-center my-4">
          <Loader size={8} color="#0f172a" />
        </div>
      )}

      {loadingError && (
        <div className="text-red-500 text-center mb-4">
          Could not load products. Please try again later.
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center text-gray-500 mt-6">No products found.</div>
      )}

      <section>
        <AddProductForm onSuccess={fetchProducts} />
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-4 rounded shadow bg-gray-100 h-35"
            >
              {editingProductId === product._id ? (
                <div>
                  <input
                    type="text"
                    className="border p-1 rounded mb-2 w-full"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <input
                    type="number"
                    className="border p-1 rounded mb-2 w-full"
                    value={editingPrice}
                    onChange={(e) => setEditingPrice(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveEdit(product._id)}
                      className="bg-green-400 px-3 py-1 rounded text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={updatingProductId === product._id}
                    >
                      {updatingProductId === product._id ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-300 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">{product.name}</h2>
                    <p className="text-green-600">
                      <span className="pt-2 text-black">Price: </span>₹
                      {product.price.toFixed(2)}/-
                    </p>
                  </div>
                  <div className="flex flex-col justify-between w-1/2 gap-3">
                    <button
                      className="bg-blue-300 px-3 py-1 rounded w-full"
                      onClick={() => startEditing(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-300 px-3 py-1 rounded w-full cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={() => deleteProduct(product._id)}
                      disabled={deletingProductId === product._id}
                    >
                      {deletingProductId === product._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductsManage;
