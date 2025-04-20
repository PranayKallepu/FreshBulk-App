"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Popup from "reactjs-popup";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

// Define types
type Product = {
  _id: string;
  name: string;
  price: number;
};

// type OrderItem = {
//   productId: string;
//   name: string;
//   quantity: number;
//   price: number;
// };

type Props = {
  initialProduct?: Product;
  products: Product[];
  onClose: () => void;
};

const OrderForm = ({ initialProduct, products }: Props) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    buyerName: "",
    buyerContact: "",
    deliveryAddress: "",
    items: [] as {
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }[],
  });

  const router = useRouter();
  const { user, isSignedIn } = useUser();

  const selected = new Map(form.items.map((item) => [item.productId, item]));

  const isValidPhone = (number: string) => /^[0-9]{10}$/.test(number);

  const handleError = (
    err: unknown,
    defaultMsg: string = "Something went wrong."
  ) => {
    const message =
      axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : defaultMsg;
    toast.error(message);
  };

  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem("buyerInfo");
      if (savedInfo) {
        const info = JSON.parse(savedInfo);
        setForm((prev) => ({ ...prev, ...info }));
        setHasSavedAddress(true);
      }
    } catch {
      toast.error("Failed to load saved address.");
    }
  }, []);

  useEffect(() => {
    if (initialProduct) {
      setForm((prev) => {
        const exists = prev.items.find(
          (item) => item.productId === initialProduct._id
        );
        if (exists) return prev;
        return {
          ...prev,
          items: [
            ...prev.items,
            {
              productId: initialProduct._id,
              name: initialProduct.name,
              price: initialProduct.price,
              quantity: 1,
            },
          ],
        };
      });
    }
  }, [initialProduct]);

  useEffect(() => {
    if (isSignedIn && user?.username) {
      setForm((prev) => ({
        ...prev,
        buyerName: user.username!,
      }));
    }
  }, [isSignedIn, user?.username]);

  const handleSelectToggle = (product: Product) => {
    setForm((prev) => {
      const existing = selected.get(product._id);
      const items = existing
        ? prev.items.filter((item) => item.productId !== product._id)
        : [
            ...prev.items,
            {
              productId: product._id,
              name: product.name,
              quantity: 1,
              price: product.price,
            },
          ];
      return { ...prev, items };
    });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1 || quantity > 10) return;
    setForm((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.productId === id ? { ...item, quantity } : item
      );
      return { ...prev, items: updatedItems };
    });
  };

  const handleSaveInfo = () => {
    const { buyerName, buyerContact, deliveryAddress } = form;
    if (!buyerContact || !deliveryAddress || !isValidPhone(buyerContact)) {
      toast.error("Please enter a valid 10-digit contact number and address.");
      return;
    }
    try {
      localStorage.setItem(
        "buyerInfo",
        JSON.stringify({ buyerName, buyerContact, deliveryAddress })
      );
      toast.success("Buyer details saved!");
      setIsEditingAddress(false);
      setHasSavedAddress(true);
    } catch {
      toast.error("Failed to save buyer info.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.error("Please sign in to place an order.");
      return;
    }
    const { buyerName, buyerContact, deliveryAddress, items } = form;
    if (!buyerName || !buyerContact || !deliveryAddress) {
      toast.error("Please fill buyer details before submitting the order.");
      return;
    }
    if (!isValidPhone(buyerContact)) {
      toast.error("Please enter a valid 10-digit contact number.");
      return;
    }
    if (items.length === 0) {
      toast.error("Please add at least one product.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/orders", form);
      toast.success("Order placed successfully!");
      router.push("/track-orders");
      setForm({
        buyerName: form.buyerName,
        buyerContact: form.buyerContact,
        deliveryAddress: form.deliveryAddress,
        items: [],
      });
    } catch (err) {
      handleError(err, "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to place an order.");
    }
  };

  return (
    <Popup
      modal
      overlayStyle={{ background: "rgba(0, 0, 0, 0.4)" }}
      contentStyle={{ background: "transparent", border: "none" }}
      trigger={
        <button
          onClick={handleOrder}
          className="mt-4 w-full border-2 border-cyan-500 text-cyan-500 px-4 py-2 rounded hover:text-white hover:bg-cyan-500 cursor-pointer"
        >
          Order
        </button>
      }
    >
      {
        ((close: () => void) => (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">
              <h2 className="text-2xl font-semibold text-center">Order Form</h2>
              <form onSubmit={handleSubmit}>
                <h2 className="text-lg font-semibold">Add Address</h2>
                <div className="space-y-2 mb-6">
                  {hasSavedAddress && !isEditingAddress ? (
                    <div className="bg-gray-100 p-4 rounded border">
                      <p>
                        <strong>Name:</strong>{" "}
                        {form.buyerName || user?.username}
                      </p>
                      <p>
                        <strong>Contact:</strong> {form.buyerContact}
                      </p>
                      <p>
                        <strong>Address:</strong> {form.deliveryAddress}
                      </p>
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        type="button"
                      >
                        Edit Address
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3 md:flex-row md:gap-6">
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">
                            Buyer Name*
                          </label>
                          <input
                            className="w-full p-2 border rounded"
                            placeholder="Buyer Name"
                            value={form.buyerName}
                            onChange={(e) =>
                              setForm({ ...form, buyerName: e.target.value })
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium mb-1">
                            Contact Number*
                          </label>
                          <input
                            className="w-full p-2 border rounded"
                            placeholder="Contact Number"
                            value={form.buyerContact}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                buyerContact: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Delivery Address*
                        </label>
                        <textarea
                          className="w-full p-2 border rounded"
                          placeholder="Delivery Address"
                          value={form.deliveryAddress}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              deliveryAddress: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button
                        onClick={handleSaveInfo}
                        type="button"
                        className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 cursor-pointer"
                      >
                        {hasSavedAddress ? "Update Details" : "Save Details"}
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">
                    Select Products
                  </h2>
                  <div className="max-h-[300px] overflow-y-auto pr-2">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {products.map((product) => {
                        console.log(product._id);
                        const isSelected = selected.has(product._id);
                        const item = selected.get(product._id);
                        return (
                          <div
                            key={product._id}
                            className="flex flex-col border bg-gray-100 rounded p-2"
                          >
                            <div className="flex flex-col items-center">
                              <span>
                                {product.name} (₹{product.price.toFixed(2)})
                              </span>
                              <div className="flex gap-3 mt-2">
                                <button
                                  onClick={() => handleSelectToggle(product)}
                                  type="button"
                                  className={`px-1 py-1 h-6 text-[12px] rounded text-white ${
                                    isSelected
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                                >
                                  {isSelected ? "Remove" : "Select"}
                                </button>
                                {isSelected && (
                                  <div className="flex gap-2 items-center">
                                    <label className="text-sm">Qty:</label>
                                    <input
                                      type="number"
                                      min={1}
                                      max={10}
                                      value={item?.quantity || 1}
                                      onChange={(e) =>
                                        handleQuantityChange(
                                          product._id,
                                          parseInt(e.target.value || "1")
                                        )
                                      }
                                      className="w-12 border rounded px-1"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
                <button
                  onClick={close}
                  type="button"
                  className="mt-2 w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )) as unknown as React.ReactNode
      }
    </Popup>
  );
};

export default OrderForm;
