"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  productId: string;
}

interface Order {
  _id: string;
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
  items: OrderItem[];
  status: string;
  createdAt: string;
}

export default function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([]);
  console.log(orders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchId, setSearchId] = useState<string>("");
  const [buyerName, setBuyerName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cancelLoading, setCancelLaoding] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const finalBuyerName = user.username || localStorage.getItem("buyerName");
    if (finalBuyerName) {
      localStorage.setItem("buyerName", finalBuyerName);
      setBuyerName(finalBuyerName);
      fetchOrders(finalBuyerName);
    }
  }, [isSignedIn, user]);

  const fetchOrders = async (name: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/orders");
      const data: Order[] = res.data;
      const buyerOrders = data.filter((order) => order.buyerName === name);
      setOrders(buyerOrders);
      setFilteredOrders(buyerOrders);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (_id: string) => {
    setSearchId(_id);
  };

  const handleCancelOrder = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmed) return;
    setCancelLaoding(true);
    try {
      await axios.delete(`/api/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
      setFilteredOrders((prev) => prev.filter((order) => order._id !== id));
      toast.success("Order canceled!");
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setCancelLaoding(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600";
      case "in progress":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-500";
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Order has been received.";
      case "in progress":
        return "Order is being processed for delivery.";
      case "delivered":
        return "Order has been delivered successfully.";
      default:
        return "Order status is currently unavailable.";
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 mt-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Order Tracking</h1>

        {/* Search Input */}
        <div className="flex flex-col md:flex-row gap-2 mb-6">
          <input
            type="text"
            value={searchId}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Enter Order ID"
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={() => handleSearch(searchId)}
            className="bg-black text-white px-6 py-2 rounded-xl cursor-pointer"
          >
            Track Order
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-center text-red-500 mb-4">
            {error}{" "}
            <button
              onClick={() => buyerName && fetchOrders(buyerName)}
              className="underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 h-20 rounded-xl"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="text-sm">
            <div className="flex justify-between text-gray-600 font-semibold border-b border-gray-200 pb-2 mb-3">
              <span>Date & Order ID</span>
              <span>Status</span>
            </div>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        &bull;
                      </span>
                      {order.status.toLowerCase() === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="ml-4 text-red-600 text-sm underline hover:text-red-800 cursor-pointer"
                        >
                          {cancelLoading ? "Canceling..." : "Cancel"}
                        </button>
                      )}
                      <p>#{order._id}</p>
                    </div>
                    <span
                      className={`font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">
                    {getStatusMessage(order.status)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
