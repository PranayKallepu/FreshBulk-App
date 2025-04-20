"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import { BsThreeDots } from "react-icons/bs";
import ItemList from "@/components/ItemsList";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  productId: number;
  totalPrice: number;
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

const ORDERS_PER_PAGE = 5;

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await axios.get("/api/orders");
      setOrders(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    _id: string,
    status: string
  ): Promise<void> => {
    setUpdatingOrderId(_id);
    setStatusLoading(true);
    try {
      await axios.put(`/api/orders/${_id}`, { status });
      setOrders((prev) =>
        prev.map((order) => (order._id === _id ? { ...order, status } : order))
      );
    } catch {
      setError(true);
    } finally {
      setUpdatingOrderId(null);
      setStatusLoading(false);
      setError(false);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toString().includes(searchTerm)) &&
      (!statusFilter || order.status === statusFilter)
  );

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const getStatusColor = (status: string): string => {
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

  return (
    <div className="p-6 mt-10 lg:ml-20 lg:mr-20">
      <h1 className="text-3xl font-bold mb-8 text-center">Orders Management</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by ID or Buyer Name"
          className="border p-2 rounded-md text-sm w-full sm:w-1/4 shadow-sm focus:ring-2 focus:ring-blue-200"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="border p-2 rounded-md text-sm w-full sm:w-1/4 shadow-sm focus:ring-2 focus:ring-blue-200"
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {loading && <Loader size={50} color="#16bfd1" />}
      {error && (
        <div className="text-red-600 text-center mt-4">
          Failed to load data.{" "}
          <button onClick={fetchOrders} className="underline text-blue-600">
            Retry
          </button>
        </div>
      )}

      {!loading && paginatedOrders.length === 0 && (
        <div className="text-center text-gray-500 mt-4">No orders found.</div>
      )}

      {!loading && paginatedOrders.length > 0 && (
        <div className="overflow-x-auto rounded-2xl shadow-sm bg-white border border-gray-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Buyer Details</th>
                <th className="px-4 py-3">Order Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    #{order._id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{order.buyerName}</div>
                    <div className="text-xs text-gray-500">
                      cell:{order.buyerContact}
                    </div>
                    <div className="text-xs">{order.deliveryAddress}</div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <ItemList items={order.items} />
                  </td>
                  <td className="px-4 py-3">
                    {statusLoading && updatingOrderId === order._id ? (
                      <BsThreeDots className="text-gray-500 animate-pulse w-5 h-5" />
                    ) : (
                      <span
                        className={`font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        ■ {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        updateOrderStatus(order._id, e.target.value)
                      }
                      disabled={updatingOrderId === order._id}
                      className="border p-2 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-200"
                    >
                      {["Pending", "In Progress", "Delivered"].map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {paginatedOrders.length > 0 && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="self-center text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
