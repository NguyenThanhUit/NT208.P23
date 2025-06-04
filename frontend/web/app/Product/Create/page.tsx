'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { getUserInformation } from '@/app/actions/useraction';

export default function Create() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkVerification() {
            try {
                const profile = await getUserInformation();
                if (profile.verificationStatus === "approved" && profile.isSeller === true) {
                    setIsAuthorized(true);
                } else {
                    alert("Bạn chưa được xác minh để tạo sản phẩm. Vui lòng đợi admin xét duyệt.");
                    router.push("/");
                }
            } catch (err) {
                console.error("Lỗi khi kiểm tra xác minh:", err);
                alert("Không thể xác minh người dùng. Vui lòng thử lại sau.");
                router.push("/");
            }
        }

        checkVerification();
    }, [router]);

    if (isAuthorized === null) {
        return <div className="text-center mt-10">Đang kiểm tra quyền truy cập...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-12 px-4">
                <ProductForm />
            </div>
        </div>
    );
}
