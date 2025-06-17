'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCurrentUser } from "@/app/actions/authactions";
import { getTotalMoney, placeBuying } from "@/app/actions/orderactions";
import { useCartStore } from "@/app/function/cartStore";
import { useRouter } from "next/navigation";

interface User {
    name: string;
}

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    seller?: string;
    key: string;
    productStatus: string;
}

export default function CartPage() {
    const [user, setUser] = useState<User | null>(null);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentResult, setPaymentResult] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const router = useRouter();


    const { items, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();

    const formatVND = (value: number) => {
        return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };

    const totalPrice = items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
    const totalQuantity = items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (!currentUser) {
                    setAuthError("⚠️ Bạn cần đăng nhập để truy cập giỏ hàng.");
                    setTimeout(() => {
                        router.push("/");
                    }, 3000);
                    return;
                }
                setUser({
                    ...currentUser,
                    name: currentUser?.username || "",
                });

                if (currentUser?.username) {
                    const wallet = await getTotalMoney(currentUser.username);
                    setWalletBalance(wallet.balance);
                }
            } catch (error) {
                console.error("Không thể lấy thông tin người dùng hoặc ví:", error);
            }
        };

        fetchUser();
    }, []);

    const handlePayment = async () => {
        if (!paymentMethod) {
            setPaymentResult("❌ Vui lòng chọn phương thức thanh toán!");
            return;
        }

        if (walletBalance === null) {
            setPaymentResult("❌ Không thể lấy số dư ví, vui lòng thử lại sau.");
            return;
        }

        if (walletBalance < totalPrice) {
            setPaymentResult("❌ Số dư ví không đủ, vui lòng nạp thêm tiền.");
            return;
        }

        const missingSellerItems = items.filter(item => !item.seller || item.seller.trim() === "");
        if (missingSellerItems.length > 0) {
            setPaymentResult("❌ Có sản phẩm chưa có Seller. Vui lòng kiểm tra lại giỏ hàng.");
            return;
        }

        setIsProcessing(true);
        setPaymentResult("");

        try {
            const orderID = crypto.randomUUID();
            const buyer = user?.name || "Unknown";

            const itemsForOrder = items.map((item: CartItem) => ({
                id: item.id,
                productId: item.productId,
                seller: item.seller!,
                productName: item.name,
                quantity: item.quantity,
                price: item.price,
                key: item.key,
                productStatus: item.productStatus,

            }));

            await placeBuying(orderID, paymentMethod, buyer, itemsForOrder);

            switch (paymentMethod) {
                case "vnpay":
                    setPaymentResult(`✅ Thanh toán thành công bằng thẻ tín dụng: ${formatVND(totalPrice)}`);
                    break;
                case "vinoibo":
                    setPaymentResult("✅ Thanh toán thành công qua ví MoMo.");
                    break;
                default:
                    setPaymentResult("✅ Thanh toán thành công.");
                    break;
            }

            clearCart();
        } catch (error) {
            console.error("Lỗi khi thanh toán:", error);
            setPaymentResult("❌ Có lỗi xảy ra khi xử lý thanh toán.");
        } finally {
            setIsProcessing(false);
        }
    };
    if (authError) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-white text-black">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">{authError}</h2>
                    <p>Bạn sẽ được chuyển hướng về trang chủ sau ít giây...</p>
                </div>
            </div>
        );
    }


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
        <div className="min-h-screen bg-gray-50 py-8 px-4 relative">
            <h1 className="text-3xl font-bold text-center mb-8">🛒 Giỏ hàng của bạn</h1>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">


                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Giỏ hàng ({items.length} vật phẩm)</h2>
                        </div>

                        <div className="border-b border-gray-200 pb-2 mb-4">
                            <div className="grid grid-cols-12 gap-4 font-medium text-gray-600">
                                <div className="col-span-4">Vật phẩm</div>
                                <div className="col-span-2">Seller</div>
                                <div className="col-span-2 text-center">Giá</div>
                                <div className="col-span-2 text-center">Số lượng</div>
                                <div className="col-span-2 text-right">Tổng</div>
                            </div>
                        </div>

                        {items.map((item: CartItem) => (
                            <div key={item.id} className="border-b border-gray-200 py-4">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-4 flex items-center gap-4">
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
                                        </div>
                                    </div>
                                    <div className="col-span-2">{item.seller || <span className="text-red-500 font-semibold">Chưa có Seller</span>}</div>
                                    <div className="col-span-2 text-center">{formatVND(item.price)}</div>
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
                                        <span>{formatVND(item.price * item.quantity)}</span>
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
                        <span>{formatVND(totalPrice)}</span>
                    </div>

                    {walletBalance !== null && (
                        <div className="flex justify-between text-gray-700 mt-2">
                            <span>Số dư ví:</span>
                            <span>{formatVND(walletBalance)}</span>
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
                            <option value="vnpay">💳 VNPAY</option>
                            <option value="vinoibo">📱 Ví nội bộ</option>
                        </select>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={`mt-6 w-full py-2 px-4 rounded-lg text-white transition
                ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
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

            {isProcessing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white rounded-lg px-6 py-4 flex items-center gap-4 shadow-lg min-w-[280px]">
                        <Spinner />
                        <span className="font-medium text-gray-700">Đang xử lý...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function Spinner() {
    return (
        <svg
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
        </svg>
    );
}
