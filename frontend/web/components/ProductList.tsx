import React from "react";
import { Order } from "..";

export default function ProductList({ orders }: { orders: Order[] }) {
    if (!orders.length) return <p className="text-center text-gray-500">Không có sản phẩm nào.</p>;

    return (
        <div className="grid grid-cols-6 gap-4 p-4">
            {orders.map((order) => (
                <div key={order.id} className="border p-4 shadow-md rounded-lg">
                    <img
                        src={order.ImageUrl || "https://via.placeholder.com/150"}
                        alt={order.Name}
                        className="w-full h-40 object-cover rounded-md"
                    />
                    <h2 className="text-lg font-semibold mt-2">{order.Name}</h2>
                    <p className="text-gray-600">{order.Category}</p>
                    <p className="text-blue-500 font-bold">${order.Price?.toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">Người bán: {order.Seller}</p>
                    <p className="text-gray-500 text-sm">Tình trạng: {order.Status}</p>
                </div>
            ))}
        </div>
    );
}
