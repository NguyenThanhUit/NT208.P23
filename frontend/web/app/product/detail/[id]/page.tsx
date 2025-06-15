"use client";

import { use, useEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions/authactions";
import { getDetailedProduct } from "@/app/actions/orderactions";
import { Navbar } from "flowbite-react/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import { User } from "next-auth";
import { useCartStore } from "@/app/function/cartStore";
import { Order } from "@/index";
import Image from "next/image";

export default function Details({ params }: { params?: Promise<{ id: string }> }) {
    const { id } = use(params ?? Promise.resolve({ id: "" }));
    const [product, setProduct] = useState<Order | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const addToCart = useCartStore((state) => state.addToCart);

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("Thiếu ID sản phẩm");
                setLoading(false);
                return;
            }

            try {
                const [productData, currentUser] = await Promise.all([
                    getDetailedProduct(id),
                    getCurrentUser(),
                ]);

                setProduct(productData);
                setUser(currentUser);
            } catch (err) {
                setError("Không thể tải dữ liệu sản phẩm.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="text-center text-lg font-semibold mt-10 min-h-screen">Đang tải...</div>;
    }

    if (error) {
        return <div className="min-h-screen text-red-600 text-center mt-10">{error}</div>;
    }

    if (!product) {
        return <div className="min-h-screen text-red-600 text-center mt-10">Không tìm thấy sản phẩm</div>;
    }

    const handleAddToCart = (order: Order) => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (quantity < 1) {
            toast.error("Số lượng phải lớn hơn hoặc bằng 1!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (quantity > product.StockQuantity) {
            toast.error(`Số lượng tối đa có thể mua là ${product.StockQuantity}`, {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        const cartItem = {
            productId: order.id,
            id: order.id,
            name: order.Name,
            price: order.Price ?? 0,
            quantity,
            imageUrl: order.ImageUrl,
            key: order.Key,
            productStatus: order.ProductStatus,
            seller: order.Seller,
        };

        addToCart(cartItem);
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!", {
            position: "top-center",
            autoClose: 3000,
        });
    };

    const increment = () => {
        setQuantity((q) => Math.min(q + 1, product.StockQuantity));
    };

    const decrement = () => {
        setQuantity((q) => Math.max(q - 1, 1));
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <ToastContainer />

            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="bg-white shadow-lg rounded-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                    {/* Image Section */}
                    <div className="md:col-span-1 flex justify-center items-center">
                        <Image
                            src={product.ImageUrl || "/placeholder.png"}
                            alt={product.Name || "Sản phẩm"}
                            width={400}
                            height={400}
                            className="rounded-lg border border-gray-300 object-contain"
                        />
                    </div>

                    <div className="md:col-span-2 flex flex-col justify-between">
                        {user?.username === product.Seller && (
                            <div className="absolute top-6 right-6 flex gap-3 z-20">
                                <EditButton id={product.id} />
                                <DeleteButton id={product.id} />
                            </div>
                        )}

                        <section className="mb-6">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{product.Name}</h2>
                            <p className="text-sm text-gray-500 mb-4 italic">Thể loại: {product.Category}</p>
                            <div className="text-4xl font-bold text-green-700 mb-4">
                                {(product.Price ?? 0).toLocaleString()} <span className="text-lg">VNĐ</span>
                            </div>
                        </section>

                        <section className="mb-8 space-y-3 text-gray-700 text-base leading-relaxed">
                            <p>
                                <span className="font-semibold text-gray-800">Người bán: </span>
                                {product.Seller === "admin" ? (
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm font-medium">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-blue-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        E-SHOP OFFICIAL
                                    </span>
                                ) : (
                                    <a
                                        href={`/seller/${product.Seller}`}
                                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {product.Seller}
                                    </a>
                                )}
                            </p>


                            <p>
                                <span className="font-semibold text-gray-800">Số lượng còn: </span>
                                {product.StockQuantity}
                            </p>
                            <div>
                                <p className="font-semibold text-gray-800 mb-1">Mô tả sản phẩm:</p>
                                <p className="whitespace-pre-line">{product.Description || "Không có mô tả."}</p>
                            </div>
                        </section>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-5">
                            {user?.username !== product.Seller && (
                                <>
                                    <div className="flex items-center border rounded-md overflow-hidden max-w-[150px]">
                                        <button
                                            onClick={decrement}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition"
                                            aria-label="Giảm số lượng"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="w-14 text-center outline-none bg-white"
                                            value={quantity}
                                            min={1}
                                            max={product.StockQuantity}
                                            readOnly
                                        />
                                        <button
                                            onClick={increment}
                                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition"
                                            aria-label="Tăng số lượng"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 max-w-xs px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition"
                                    >
                                        🛒 Thêm vào giỏ hàng
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition"
                            >
                                ← Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
