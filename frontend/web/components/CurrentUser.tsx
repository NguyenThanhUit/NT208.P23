'use client';

import { signOut, useSession } from "next-auth/react";

export default function CurrentUser() {
    const { data: session } = useSession();

    if (!session) return null;

    function handleSignOut() {
        signOut({ callbackUrl: '/' }); // ✅ Xóa session và chuyển về trang chủ
    }

    return (
        <div className="flex items-center gap-4">
            <p className="text-gray-800">{session.user?.name}</p>
            <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700">
                ĐĂNG XUẤT
            </button>
        </div>
    );
}
