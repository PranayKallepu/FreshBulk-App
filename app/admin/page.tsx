"use client";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-300 px-4 py-12">
      <div className="w-full max-w-2xl bg-gradient-to-br from-indigo-100 to-blue-100 p-8 rounded-lg shadow-lg text-center md:h-80 md:flex flex-col justify-center ">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Admin Dashboard
        </h1>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button
            onClick={() => router.push("/admin/orders-manage")}
            className="w-full md:w-1/2 bg-indigo-700 hover:bg-indigo-600 text-white font-medium py-3 rounded transition duration-200 cursor-pointer"
          >
            Orders Management
          </button>
          <button
            onClick={() => router.push("/admin/products-manage")}
            className="w-full md:w-1/2 bg-teal-600 hover:bg-teal-500 text-white font-medium py-3 rounded transition duration-200 cursor-pointer"
          >
            Products Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
