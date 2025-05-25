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
                <div className="lg:col-span-3 grid gap-6 grid-cols-1 sm:grid-cols-2">
                    {items.map((item: CartItem) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-md p-4 flex gap-4 border border-gray-200 relative">
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm px-2 py-1"
                            >
                                ❌
                            </button>

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
                                    <h2 className="text-lg font-semibold">{item.name}</h2>
                                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <button
                                        onClick={() => decreaseQuantity(item.id)}
                                        className="px-2 py-1 text-white bg-gray-500 rounded-full"
                                    >
                                        -
                                    </button>

                                    <span className="text-lg font-semibold">{item.quantity}</span>

                                    <button
                                        onClick={() => increaseQuantity(item.id)}
                                        className="px-2 py-1 text-white bg-gray-500 rounded-full"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="text-blue-600 font-bold text-lg mt-2">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

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
