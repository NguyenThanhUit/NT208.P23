"use client";

import { useEffect, useState } from "react";

export default function RechargeResultPage() {
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchCallback = async () => {
            try {
                const currentUrl = window.location.href;
                const queryParams = currentUrl.split("?")[1];

                if (!queryParams) {
                    setError("Không có dữ liệu giao dịch.");
                    return;
                }

                const response = await fetch(`http://localhost:7004/api/Vnpay/Callback?${queryParams}`);
                const data = await response.json();

                setResult(data);
            } catch (err) {
                console.error(err);
                setError("Lỗi khi truy vấn kết quả thanh toán.");
            }
        };

        fetchCallback();
    }, []);

    if (error) return <div className="text-red-600 p-4">{error}</div>;

    if (!result) return <div className="p-4">Đang kiểm tra kết quả thanh toán...</div>;

    return (
        <div className="p-4">
            {result.isSuccess ? (
                <div className="text-green-600">
                    ✅ Giao dịch thành công với số tiền: {result.money} VND
                </div>
            ) : (
                <div className="text-red-600">
                    ❌ Giao dịch thất bại: {result?.paymentResponse?.description || "Không rõ lỗi"}
                </div>
            )}
        </div>
    );
}
