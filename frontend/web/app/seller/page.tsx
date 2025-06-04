'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues } from "react-hook-form";
import { ShieldCheck, CreditCard, ImageIcon } from "lucide-react";
import { makeSeller } from "../actions/useraction";

export default function SellerRequestForm() {
    const router = useRouter();

    const [form, setForm] = useState({
        idCardNumber: "",
        idCardImageUrl: "",
        bankAccount: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const result = await makeSeller(form as FieldValues);
            if (result?.message) {
                setMessage(result.message);
                setTimeout(() => router.push("/"), 2000);
            } else {
                setMessage("Có lỗi xảy ra khi gửi yêu cầu.");
            }
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            setMessage("Lỗi hệ thống.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-indigo-200 px-4">
            <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-xl">
                <div className="text-center mb-6">
                    <ShieldCheck className="mx-auto h-12 w-12 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800 mt-2">Yêu cầu trở thành người bán</h1>
                    <p className="text-gray-500 text-sm mt-1">Điền thông tin bên dưới để xác minh</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <CreditCard className="inline-block mr-1 w-4 h-4" />
                            Số CMND/CCCD
                        </label>
                        <input
                            type="text"
                            name="idCardNumber"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.idCardNumber}
                            onChange={handleChange}
                            placeholder="VD: 123456789012"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <ImageIcon className="inline-block mr-1 w-4 h-4" />
                            URL ảnh CMND/CCCD
                        </label>
                        <input
                            type="text"
                            name="idCardImageUrl"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.idCardImageUrl}
                            onChange={handleChange}
                            placeholder="https://image-url.com/cmnd.jpg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            💳 Tài khoản ngân hàng
                        </label>
                        <input
                            type="text"
                            name="bankAccount"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.bankAccount}
                            onChange={handleChange}
                            placeholder="VD: 0123456789 - Vietcombank"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
                    >
                        {loading ? "Đang gửi..." : "Gửi yêu cầu xác minh"}
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-green-600 font-semibold animate-pulse">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
