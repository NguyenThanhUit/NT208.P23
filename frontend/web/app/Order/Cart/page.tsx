'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCurrentUser } from "@/app/actions/authactions";
import { getTotalMoney, placeBuying } from "@/app/actions/orderactions";
import { useCartStore } from "@/app/function/cartStore";

interface User {
    name: string;
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    seller?: string;
    estimatedShipDate?: string;
    fuelSource?: string;
    isBundle?: boolean;
    protectionAvailable?: boolean;
}

export default function CartPage() {
    const [user, setUser] = useState<User | null>(null);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentResult, setPaymentResult] = useState("");

    const { items, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();

    const totalPrice = items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
    const totalQuantity = items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            setUser({
                ...currentUser,
                name: currentUser?.username || "",
            });

            if (currentUser?.username) {
                try {
                    const wallet = await getTotalMoney(currentUser.username);
                    setWalletBalance(wallet.balance);
                } catch (error) {
                    console.error("Không thể lấy ví:", error);
                }
            }
        };

        fetchUser();
    }, []);

    const handlePayment = async () => {
        if (!paymentMethod) {
            setPaymentResult("❌ Vui lòng chọn phương thức thanh toán!");
            return;
        }

        if (paymentMethod !== "cod" && walletBalance !== null && totalPrice > walletBalance) {
            setPaymentResult("❌ Số dư ví không đủ để thanh toán đơn hàng này.");
            return;
        }

        try {
            const orderID = crypto.randomUUID();
            const buyer = user?.name || "Unknown";

            const itemsForOrder = items.map((item: CartItem) => ({
                seller: item.seller || "Unknown",
                productName: item.name,
                quantity: item.quantity,
                price: item.price,
            }));

            await placeBuying(orderID, paymentMethod, buyer, itemsForOrder);

            switch (paymentMethod) {
                case "credit":
                    setPaymentResult(`✅ Thanh toán thành công bằng thẻ tín dụng: $${totalPrice.toFixed(2)}`);
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
            <div className="flex items-center justify-center min-h-[60vh] bg-white text-black">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">Giỏ hàng đang trống</h2>
                    <p>Hãy thêm một vài sản phẩm nhé!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">🛒 Giỏ hàng của bạn</h1>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Phần hiển thị item - Đã chỉnh sửa để giống UI trong hình */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Your Cart ({items.length} items)</h2>
                        </div>

                        <div className="border-b border-gray-200 pb-2 mb-4">
                            <div className="grid grid-cols-12 gap-4 font-medium text-gray-600">
                                <div className="col-span-6">Item</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>
                        </div>

                        {items.map((item: CartItem) => (
                            <div key={item.id} className="border-b border-gray-200 py-4">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-6 flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                            <Image
                                                src={item.imageUrl || "https://via.placeholder.com/150?text=No+Image"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{item.name}</h3>
                                            {item.estimatedShipDate && (
                                                <p className="text-sm text-gray-500">(Estimated Ship Date: {item.estimatedShipDate})</p>
                                            )}
                                            {item.fuelSource && (
                                                <p className="text-sm text-gray-500">Fuel Source: {item.fuelSource}</p>
                                            )}
                                            {item.isBundle && (
                                                <button className="text-sm text-blue-600 hover:underline mt-1">
                                                    Add accident protection for $29.99
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center">${item.price.toFixed(2)}</div>
                                    <div className="col-span-2 flex justify-center">
                                        <div className="flex items-center border border-gray-200 rounded-md">
                                            <button
                                                onClick={() => decreaseQuantity(item.id)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                                                aria-label="Giảm số lượng"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center text-base font-medium text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => increaseQuantity(item.id)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                                                aria-label="Tăng số lượng"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex justify-end items-center gap-2">
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 text-lg font-semibold transition"
                                            aria-label="Xóa sản phẩm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phần thanh toán - Giữ nguyên như cũ */}
                <div className="bg-white p-6 rounded-xl shadow-md h-fit">
                    <h2 className="text-xl font-bold mb-4">🧾 Thông tin đơn hàng</h2>

                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Tổng số mặt hàng:</span>
                        <span>{items.length}</span>
                    </div>

                    <div className="flex justify-between text-gray-700 mb-2">
                        <span>Tổng số lượng:</span>
                        <span>{totalQuantity}</span>
                    </div>

                    <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
                        <span>Tổng thanh toán:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    {walletBalance !== null && (
                        <div className="flex justify-between text-gray-700 mt-2">
                            <span>Số dư ví:</span>
                            <span>${walletBalance?.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="mt-6">
                        <label className="block font-semibold mb-2">Phương thức thanh toán:</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">-- Chọn --</option>
                            <option value="credit">💳 Thẻ tín dụng</option>
                            <option value="momo">📱 Ví MoMo</option>
                        </select>
                    </div>

                    <button
                        onClick={handlePayment}
                        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        Thanh toán
                    </button>

                    {paymentResult && (
                        <div
                            className={`mt-4 p-3 border rounded ${paymentResult.startsWith("✅")
                                ? "bg-green-100 border-green-400 text-green-700"
                                : "bg-red-100 border-red-400 text-red-700"
                                }`}
                        >
                            {paymentResult}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}