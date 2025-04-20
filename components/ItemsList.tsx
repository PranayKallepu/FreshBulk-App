"use client";
import React from "react";
import Popup from "reactjs-popup";

interface Item {
  name: string;
  totalPrice: number;
  quantity: number;
}

interface ItemListProps {
  items: Item[];
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
  const total = items.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <Popup
      trigger={
        <button className="text-blue-600 underline hover:text-blue-800">
          {items.length} item(s)
        </button>
      }
      modal
      overlayStyle={{ background: "rgba(0, 0, 0, 0.4)" }}
      contentStyle={{
        background: "transparent",
        border: "none",
        minWidth: "300px",
      }}
      nested
    >
      {
        ((close: () => void) => (
          <div className="p-6 bg-white rounded-2xl shadow-xl max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Ordered Products
            </h2>
            <ul className="space-y-3 pr-2">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="border-b pb-2 flex justify-between items-center text-sm sm:text-base"
                >
                  <div className="font-semibold">{idx + 1}.</div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-500">
                    Qty: {item.quantity} • ₹{item.totalPrice}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 text-right font-semibold text-gray-800">
              Total: ₹{total}
            </div>

            <button
              onClick={close}
              className="mt-4 w-full sm:w-auto px-4 py-2 text-sm bg-red-300 rounded hover:bg-red-400"
            >
              Close
            </button>
          </div>
        )) as unknown as React.ReactNode
      }
    </Popup>
  );
};

export default ItemList;
