'use client';

import React from "react";
import { Order } from "..";
import { Button } from "flowbite-react";
import Link from "next/link";
import { useCartStore } from "@/app/function/cartStore";

export default function ProductList({ orders }: { orders: Order[] }) {
    const addToCart = useCartStore((state) => state.addToCart);

    if (!orders.length) return <p className="text-center text-gray-500">Không có sản phẩm nào.</p>;

    // // const handleAddToCart = (order: Order) => {
    //     addToCart({
    //         id: order.id,
    //         name: order.Name,
    //         price: order.Price || 0,
    //         quantity: 1,
    //         imageUrl: order.ImageUrl,
    //     });
    // };

    return (
        <div className="grid grid-cols-6 gap-4 p-4">
            {orders.map((order) => (
                <div key={order.id} className="border p-4 shadow-md rounded-lg bg-white">
                    <Link href={`/Order/Detail/${order.id}`}>
                        <img
                            src={order.ImageUrl || "https://via.placeholder.com/150"}
                            alt={order.Name}
                            className="w-full h-40 object-cover rounded-md"
                        />
                        <h2 className="text-lg font-semibold mt-2 text-gray-800">{order.Name}</h2>
                        <p className="text-gray-600">{order.Category}</p>
                        <p className="text-blue-500 font-bold">${order.Price?.toFixed(2)}</p>
                        <p className="text-gray-500 text-sm">Người bán: {order.Seller}</p>
                    </Link>
                    <Button
                        onClick={() =>
                            addToCart({
                                id: order.id,
                                name: order.Name,
                                price: order.Price ?? 0,
                                quantity: 1,
                                imageUrl: order.ImageUrl
                            })
                        }
                        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </div>
            ))}
        </div>
    );
}
