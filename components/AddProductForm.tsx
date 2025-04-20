"use client";

import { useState } from "react";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import toast from "react-hot-toast";

export default function AddProductForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);
    if (!name || price === "") {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/products", {
        name,
        price: parseInt(String(price)),
      });
      setSuccess(true);
      setName("");
      setPrice("");
      toast.success("Product added successfully!");
      onSuccess();
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product.");
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popup
      modal
      overlayStyle={{ background: "rgba(0, 0, 0, 0.4)" }}
      contentStyle={{
        background: "transparent",
        border: "none",
        minWidth: "300px",
      }}
      trigger={
        <button className="bg-black text-white px-4 py-2 rounded-xl cursor-pointer">
          + Add Product
        </button>
      }
      nested
    >
      {
        ((close: () => void) => (
          <div className="p-6 border-2 bg-white rounded-2xl shadow-xl max-w-sm mx-auto">
            <div className="p-6 border-2 bg-white rounded-2xl shadow-xl max-w-sm mx-auto">
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  className="w-full p-2 border rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="w-full p-2 border rounded-xl"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value === "" ? "" : parseFloat(e.target.value)
                    )
                  }
                />

                {error && <p className="text-red-500">{error}</p>}
                {success && (
                  <p className="text-green-600">Product added successfully!</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={close}
                    className="px-4 py-2 rounded-xl border border-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await handleSubmit();
                      if (!error) close();
                    }}
                    className="bg-black text-white px-4 py-2 rounded-xl cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) as unknown as React.ReactNode
      }
    </Popup>
  );
}
