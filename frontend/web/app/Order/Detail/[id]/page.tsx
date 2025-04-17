"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/app/actions/authactions";
import { getDetailedProduct } from "@/app/actions/orderactions";
import { Navbar } from "flowbite-react/components/Navbar";
import Footer from "@/components/Footer";

export default function Details({ params }: { params?: { id: string } }) {
    const [product, setProduct] = useState<any | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!params?.id) {
                setError("Thiếu ID sản phẩm");
                setLoading(false);
                return;
            }

            try {
                const [orderData, currentUser] = await Promise.all([
                    getDetailedProduct(params.id),
                    getCurrentUser(),
                ]);

                setProduct(orderData);
                setUser(currentUser);
            } catch (err) {
                console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
                setError("Không thể tải dữ liệu sản phẩm.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params?.id]);

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
            <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 flex gap-8">
                {/* Hình ảnh sản phẩm */}
                <div className="w-1/2">
                    <img
                        src={product.imageUrl || "https://via.placeholder.com/500"}
                        alt={product.name || "Sản phẩm"}
                        className="w-full h-[500px] object-cover rounded-md shadow-sm"
                    />
                </div>

                {/* Thông tin chi tiết */}
                <div className="w-1/2 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                        <p className="text-lg text-gray-600 mt-1">{product.category}</p>
                        <p className="text-3xl font-bold text-green-600 mt-3">
                            {product.price?.toLocaleString()} VNĐ
                        </p>
                        <p className="text-gray-600 mt-2">
                            <span className="font-semibold">Người bán:</span> {product.seller}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Số lượng còn:</span> {product.stockQuantity}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Mô tả:</span> {product.description || "Không có"}
                        </p>
                    </div>

                    {/* Nút hành động */}
                    <div className="mt-6 flex flex-col gap-3">
                        <button
                            className="px-6 py-3 bg-red-600 text-white text-lg font-bold rounded-lg hover:bg-red-700 transition-all"
                        >
                            🛒 Thêm vào giỏ hàng
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="px-6 py-3 bg-gray-700 text-white text-lg rounded-lg hover:bg-gray-800 transition-all"
                        >
                            ← Quay lại
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
