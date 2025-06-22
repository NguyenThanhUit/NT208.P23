'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchCallback = async () => {
            try {
                const currentUrl = window.location.href;
                console.log("[VNPay Callback] Current URL:", currentUrl);

                const queryParams = currentUrl.split("?")[1];
                console.log("[VNPay Callback] Query Params:", queryParams);

                if (!queryParams) {
                    setError("Không có dữ liệu giao dịch.");
                    return;
                }

                const url = `https://api.nguyenth4nh.xyz/Vnpay/Callback?${queryParams}`;
                console.log("[VNPay Callback] Fetching from:", url);

                const response = await fetch(url);
                const data = await response.json();

                console.log("[VNPay Callback] API response:", data);

                setResult(data);
            } catch (err) {
                console.error("[VNPay Callback] Fetch error:", err);
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
