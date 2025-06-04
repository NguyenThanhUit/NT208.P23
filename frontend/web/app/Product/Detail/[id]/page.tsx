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

export default function Details({ params }: { params?: Promise<{ id: string }> }) {
    const { id } = use(params ?? Promise.resolve({ id: "" }));
    const [product, setProduct] = useState<any | null>(null);
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

                console.log("Dữ liệu sản phẩm nhận được từ server:", productData);
                console.log("Thông tin user hiện tại:", currentUser);

                setProduct(productData);
                setUser(currentUser);
            } catch (err) {
                console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
                setError("Không thể tải dữ liệu sản phẩm.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleAddToCart = (order: Order) => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        try {
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
                id: order.id,
                name: order.Name,
                price: order.Price ?? 0,
                quantity,
                imageUrl: order.ImageUrl,
            };

            console.log("Dữ liệu thêm vào giỏ hàng:", cartItem);

            addToCart(cartItem);
            toast.success("Sản phẩm đã được thêm vào giỏ hàng!", {
                position: "top-center",
                autoClose: 3000,
            });
        } catch (err) {
            console.error("Lỗi khi thêm vào giỏ hàng:", err);
            toast.error("Không thể thêm sản phẩm vào giỏ hàng!", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const increment = () => {
        setQuantity((q) => Math.min(q + 1, product.StockQuantity));
    };

    const decrement = () => {
        setQuantity((q) => Math.max(q - 1, 1));
    };

    if (loading) {
        return <div className="text-center text-lg font-semibold mt-10">Đang tải...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    if (!product) {
        return <div className="text-red-500 text-center mt-10">Không tìm thấy sản phẩm</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <ToastContainer />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-10 relative">

                    <div className="w-full">
                        <img
                            src={product.ImageUrl || "https://via.placeholder.com/500"}
                            alt={product.Name || "Sản phẩm"}
                            className="w-full h-[500px] object-cover rounded-md border"
                        />
                    </div>


                    <div className="flex flex-col justify-between">
                        {user?.username === product.Seller && (
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                <EditButton id={product.id} />
                                <DeleteButton id={product.id} />
                            </div>
                        )}

                        <div>
                            <h2 className="text-2xl font-bold text-black">Sản phẩm</h2>
                            <h1 className="text-5xl font-bold text-red-900 mb-2">{product.Name}</h1>
                            <p className="text-sm text-gray-500 mb-4">Thể loại: {product.Category}</p>

                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {(product.Price ?? 0).toLocaleString()} <span className="text-lg">VNĐ</span>
                            </div>

                            <div className="mt-4 text-gray-700 text-base space-y-2">
                                <p>
                                    <span className="font-semibold">Người bán: </span>
                                    <a
                                        href={`/seller/${product.Seller}`}
                                        className="text-blue-600 hover:underline cursor-pointer"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {product.Seller}
                                    </a>
                                </p>
                                <p><span className="font-semibold">Số lượng còn:</span> {product.StockQuantity}</p>
                                <p><span className="font-semibold">Mô tả:</span></p>
                                <p className="whitespace-pre-line">{product.Description || "Không có mô tả."}</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                            {user?.username !== product.Seller && (
                                <>
                                    <div className="flex items-center border rounded-md overflow-hidden max-w-[150px]">
                                        <button
                                            onClick={decrement}
                                            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 transition"
                                            aria-label="Giảm số lượng"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="w-12 text-center outline-none"
                                            value={quantity}
                                            min={1}
                                            max={product.StockQuantity}
                                            readOnly
                                        />
                                        <button
                                            onClick={increment}
                                            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 transition"
                                            aria-label="Tăng số lượng"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white text-base font-medium rounded hover:bg-blue-700 transition"
                                    >
                                        🛒 Thêm vào giỏ hàng
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center justify-center px-5 py-3 bg-gray-800 text-white text-base font-medium rounded hover:bg-gray-900 transition"
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
