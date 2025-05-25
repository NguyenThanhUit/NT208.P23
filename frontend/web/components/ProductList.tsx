"use client";

import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import Link from "next/link";
import { useCartStore } from "@/app/function/cartStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser } from "@/app/actions/authactions";
import { Order } from "..";


export default function ProductList({ orders }: { orders: Order[] }) {
    const addToCart = useCartStore((state) => state.addToCart);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Unable to fetch user information.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    if (!orders.length) {
        return <p className="text-center text-gray-500">No products available.</p>;
    }

    const handleAddToCart = (order: Order) => {
        if (order.StockQuantity === 0) {
            toast.error("Product out of stock!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (!user) {
            toast.error("Please log in to add to cart!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        try {
            addToCart({
                id: order.id,
                name: order.Name,
                price: order.Price ?? 0,
                quantity: 1,
                imageUrl: order.ImageUrl,
            });
            toast.success("Product added to cart!", {
                position: "top-center",
                autoClose: 3000,
            });
        } catch (err) {
            console.error("Error adding to cart:", err);
            toast.error("Failed to add product to cart!", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <ToastContainer />
            <div className="grid grid-cols-6 gap-4 p-4">
                {orders.map((order) => (
                    <div key={order.id} className="border p-4 shadow-md rounded-lg bg-white flex flex-col">
                        <Link href={`/Product/Detail/${order.id}`}>
                            <img
                                src={order.ImageUrl || "https://via.placeholder.com/150"}
                                alt={order.Name}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <h2 className="text-lg font-semibold mt-2 text-gray-800">{order.Name}</h2>
                            <p className="text-gray-600">{order.Category}</p>
                            <p className="text-blue-500 font-bold">Price: {order.Price?.toLocaleString()} VNĐ</p>
                            <p className="text-red-600 font-bold">Stock: {order.StockQuantity}</p>
                            <p className="text-gray-500 text-sm">Seller: {order.Seller}</p>
                        </Link>

                        <Button
                            onClick={() => handleAddToCart(order)}
                            disabled={order.StockQuantity === 0}
                            className={`mt-3 w-full font-semibold py-2 px-4 rounded-lg transition ${order.StockQuantity === 0
                                ? "bg-red-600 cursor-not-allowed hover:bg-red-600"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                        >
                            {order.StockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}