"use client";

import React, { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/app/function/cartStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser } from "@/app/actions/authactions";
import { Order } from "..";

interface User {
    id?: string;
    username: string;
    email?: string | null;
}


interface ProductListProps {
    orders: Order[];
}

export default function ProductList({ orders }: ProductListProps) {
    const addToCart = useCartStore((state) => state.addToCart);
    const cartItems = useCartStore((state) => state.items);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                console.error("❌ Error fetching user:", err);
                setError("Unable to fetch user information.");
            }
        };
        fetchUser();
    }, []);


    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    if (!orders.length) {
        return (
            <p className="text-center text-gray-500 mt-10">Không có sản phẩm nào cả.</p>
        );
    }

    const handleAddToCart = (order: Order) => {
        const isOutOfStock = !order.StockQuantity || order.StockQuantity <= 0;

        if (isOutOfStock) {
            toast.error("Sản phẩm đã hết hàng!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (user.email === order.Seller) {
            toast.warning("Bạn không thể mua sản phẩm của chính mình!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        const existingItem = cartItems.find((item) => item.id === order.id);
        const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

        if (currentQuantityInCart + 1 > (order.StockQuantity ?? 0)) {
            toast.warning(`Bạn chỉ có thể mua tối đa ${order.StockQuantity} sản phẩm này.`, {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        try {
            addToCart({
                id: order.id,
                productId: order.id,
                name: order.Name,
                price: order.Price ?? 0,
                seller: order.Seller,
                quantity: 1,
                imageUrl: order.ImageUrl,
                key: order.Key,
                productStatus: order.ProductStatus,
            });
            toast.success("Đã thêm sản phẩm vào giỏ hàng!", {
                position: "top-center",
                autoClose: 3000,
            });
        } catch (err) {
            console.error("Error adding to cart:", err);
            toast.error("Thêm sản phẩm vào giỏ hàng thất bại!", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-6">
            <ToastContainer />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {orders.map((order) => {
                    const isOutOfStock = !order.StockQuantity || order.StockQuantity <= 0;
                    const isSeller = user?.username === order.Seller;
                    return (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
                        >
                            <Link href={`/product/detail/${order.id}`} className="block p-4 flex-grow">
                                <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                                    <Image
                                        src={order.ImageUrl || "/placeholder-300x200.png"}
                                        alt={order.Name}
                                        layout="fill"
                                        objectFit="cover"
                                        priority={true}
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{order.Name}</h3>
                                <p className="text-sm text-gray-500 mb-1">{order.Category}</p>
                                <p className="text-blue-600 font-bold mb-2">
                                    Giá: {order.Price?.toLocaleString()} VNĐ
                                </p>
                                <p className={`font-semibold mb-1 ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                                    Số lượng: {order.StockQuantity}
                                </p>
                                <p className="text-gray-400 text-xs flex items-center gap-1">
                                    Người bán:{" "}
                                    {order.Seller === "admin" ? (
                                        <span
                                            className="text-blue-600 font-semibold flex items-center gap-1 group relative"
                                        >
                                            E-SHOP OFFICIAL
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-blue-500"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 0C5.371 0 0 5.371 0 12c0 6.63 5.371 12 12 12s12-5.37 12-12c0-6.629-5.371-12-12-12zm0 22c-5.525 0-10-4.475-10-10S6.475 2 12 2s10 4.475 10 10-4.475 10-10 10zm1-15h-2v6h2V7zm0 8h-2v2h2v-2z" />
                                            </svg>
                                            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-3 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition z-50 whitespace-nowrap shadow-lg">
                                                Tài khoản chính chủ của cửa hàng
                                            </span>
                                        </span>
                                    ) : (
                                        <span>{order.Seller}</span>
                                    )}
                                </p>

                            </Link>

                            {!isSeller && (
                                <Button
                                    onClick={() => handleAddToCart(order)}
                                    disabled={isOutOfStock}
                                    className={`mx-4 mb-4 font-semibold py-2 rounded-lg transition
                    ${isOutOfStock
                                            ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }`}
                                >
                                    {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
