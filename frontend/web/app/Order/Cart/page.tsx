'use client';

import { getCurrentUser } from "@/app/actions/authactions";
import { placeBuying } from "@/app/actions/orderactions";
import { useCartStore } from "@/app/function/cartStore";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";

// Define the type for user
interface User {
    name: string;
}

export default function CartPage() {
    const [user, setUser] = useState<User | null>(null);
    const { items, clearCart, increaseQuantity, decreaseQuantity } = useCartStore(); // Updated to use increaseQuantity and decreaseQuantity
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentResult, setPaymentResult] = useState("");

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            setUser({
                ...currentUser,
                name: currentUser?.name || "",
            });
        };

        fetchUser();
    }, []);

    const handlePayment = async () => {
        if (!paymentMethod) {
            setPaymentResult("Vui lòng chọn phương thức thanh toán!");
            return;
        }

        try {
            const orderID = crypto.randomUUID(); // Hoặc dùng Date.now().toString()
            const buyer = user?.name || "Unknown";

            const itemsForOrder = items.map((item) => ({
                seller: item.seller || "Unknown",
                productName: item.name,
                quantity: item.quantity,
            }));

            await placeBuying(orderID, paymentMethod, buyer, itemsForOrder);

            switch (paymentMethod) {
                case "credit":
                    setPaymentResult(`✅ Thanh toán thành công bằng thẻ tín dụng: $${totalPrice.toFixed(2)}`);
                    break;
                case "cod":
                    setPaymentResult("✅ Đặt hàng thành công. Vui lòng chuẩn bị tiền mặt khi nhận hàng.");
                    break;
                case "momo":
                    setPaymentResult("✅ Thanh toán thành công qua ví MoMo.");
                    break;
            }

            clearCart();
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            setPaymentResult("❌ Có lỗi xảy ra khi xử lý thanh toán.");
        }
    };


    if (items.length === 0) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[60vh] bg-white text-black">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-2 text-black">Giỏ hàng đang trống</h2>
                        <p className="text-black-400">Hãy thêm một vài sản phẩm nhé!</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <h1 className="text-3xl font-bold text-black text-center mb-8">🛒 Giỏ hàng của bạn</h1>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 grid gap-6 grid-cols-1 sm:grid-cols-2">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex gap-4">
                            <div className="relative w-32 h-32 flex-shrink-0">
                                <Image
                                    src={item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded"
                                />
                            </div>
                            <div className="flex flex-col justify-between flex-grow">
                                <div>
                                    <h2 className="text-lg font-semibold text-black">{item.name}</h2>
                                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => decreaseQuantity(item.id)} // Decrease quantity
                                        className="px-2 py-1 text-white bg-gray-500 rounded-full"
                                    >
                                        -
                                    </button>

                                    <span className="text-lg font-semibold">{item.quantity}</span>

                                    <button
                                        onClick={() => increaseQuantity(item.id)} // Increase quantity
                                        className="px-2 py-1 text-white bg-gray-500 rounded-full"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="text-blue-600 font-bold text-lg">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md h-fit">
                    <h2 className="text-xl font-bold mb-4 text-black">🧾 Thông tin đơn hàng</h2>

                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Tổng số mặt hàng:</span>
                        <span>{items.length}</span>
                    </div>

                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Tổng số lượng:</span>
                        <span>{totalQuantity}</span>
                    </div>

                    <div className="flex justify-between font-bold text-lg text-black border-t pt-4 mt-4">
                        <span>Tổng thanh toán:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="mt-6">
                        <label className="block font-semibold mb-2 text-black">Phương thức thanh toán:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full border text-black border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">-- Chọn --</option>
                            <option value="credit">💳 Thẻ tín dụng</option>
                            <option value="momo">📱 Ví MoMo</option>
                            <option value="cod">💵 Thanh toán khi nhận hàng (COD)</option>
                        </select>
                    </div>

                    <button
                        onClick={handlePayment}
                        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        Thanh toán
                    </button>

                    {paymentResult && (
                        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {paymentResult}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
