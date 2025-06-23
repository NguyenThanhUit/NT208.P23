"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "../actions/authactions";
import { depositMoneyviaVnPay, depositMoney, getTotalMoney } from "../actions/orderactions";
import { User } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RechargePage() {
    const [user, setUser] = useState<User | null>(null);
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [method, setMethod] = useState<"internal" | "vnpay">("internal");
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (!currentUser) {
                    alert("❌ Bạn cần đăng nhập để truy cập trang nạp tiền.");
                    router.push("/");
                    return;
                }
                const wallet = await getTotalMoney(currentUser!.username);
                setWalletBalance(wallet.balance);
                setUser(currentUser);
            } catch (err) {
                console.error("Lỗi khi lấy user:", err);
            }
        };
        loadUser();
    }, []);

    const handleQuickSelect = (value: number) => {
        setAmount(value);
    };

    const onSubmit = async () => {
        if (!user) {
            setMessage("❌ Bạn chưa đăng nhập.");
            return;
        }

        if (amount <= 0) {
            setMessage("❌ Vui lòng chọn hoặc nhập số tiền hợp lệ.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const depositData = {
                userId: user.username,
                amount,
            };

            if (method === "vnpay") {
                const saved = await depositMoney(depositData);
                if (saved?.error) {
                    setMessage("❌ Không thể lưu thông tin giao dịch.");
                    return;
                }

                const description = `Nạp tiền cho tài khoản ${user.username}`;
                const response = await depositMoneyviaVnPay(amount, description);

                if (typeof response === "string") {
                    window.location.href = response;
                    return;
                } else {
                    setMessage("❌ Không thể tạo liên kết thanh toán.");
                }
            } else {
                const response = await depositMoney(depositData);
                if (!response?.error) {
                    setMessage(`✅ Nạp thành công! Số dư mới: ${response.balance} VND`);
                    setWalletBalance(response.balance);
                    setAmount(0);
                } else {
                    setMessage(response.error.message || "❌ Lỗi khi nạp tiền.");
                }
            }
        } catch (error) {
            console.error(error);
            setMessage("❌ Có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center justify-center px-4 py-10">
            <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8 relative overflow-hidden">
                <Image
                    src="https://cdn.pixabay.com/photo/2021/08/16/23/09/wallet-6551548_1280.png"
                    alt="Wallet"
                    width={96}
                    height={96}
                    className="mx-auto mb-4 animate-pulse"
                />

                <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-2">
                    Nạp tiền vào ví
                </h1>

                {user && (
                    <div className="text-center text-gray-700 text-sm mb-4">
                        👋 Xin chào <strong>{user.username}</strong>!
                    </div>
                )}

                {walletBalance !== null && (
                    <div className="bg-green-100 text-green-800 text-center rounded-lg py-3 px-4 mb-6 font-semibold shadow">
                        💰 Số dư ví hiện tại: {walletBalance?.toLocaleString()} VND
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Chọn mệnh giá nhanh</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[10000, 20000, 50000, 100000, 200000, 500000].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => handleQuickSelect(val)}
                                    className="border rounded px-3 py-2 text-sm bg-gray-50 hover:bg-blue-100 active:scale-95 transition-all"
                                >
                                    {val.toLocaleString()}đ
                                </button>
                            ))}
                        </div>
                    </div>


                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Hoặc nhập số tiền</label>
                        <input
                            type="number"
                            placeholder="Nhập số tiền (VND)"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="border p-3 w-full rounded focus:outline-blue-400"
                            min={1000}
                        />
                    </div>


                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Phương thức thanh toán</label>
                        <div className="flex flex-col space-y-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="method"
                                    checked={method === "vnpay"}
                                    onChange={() => setMethod("vnpay")}
                                />
                                <span>Thanh toán qua VNPAY</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="method"
                                    checked={method === "internal"}
                                    onChange={() => setMethod("internal")}
                                />
                                <span>Sử dụng ví nội bộ</span>
                            </label>
                        </div>
                    </div>


                    <button
                        onClick={onSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận nạp tiền"}
                    </button>


                    {message && (
                        <p className="text-center text-sm text-gray-800 mt-2 whitespace-pre-line bg-gray-100 rounded p-2">
                            {message}
                        </p>
                    )}
                </div>

                <p className="text-xs text-center text-gray-400 mt-8">
                    © {new Date().getFullYear()} Ví điện tử UIT. Mọi quyền được bảo lưu.
                </p>
            </div>
        </div>
    );
}