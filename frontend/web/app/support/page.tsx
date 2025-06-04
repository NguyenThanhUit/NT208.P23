'use client';

import { FaFacebook } from 'react-icons/fa';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Hỗ trợ khách hàng</h1>
                <p className="text-gray-700 mb-4">
                    Nếu bạn cần hỗ trợ, vui lòng liên hệ:
                </p>
                <ul className="space-y-3">
                    <li>
                        📧 Email:{" "}
                        <a href="mailto:support@eshop.com" className="text-red-600 hover:underline">
                            22521349@gm.uit.edu.vn
                        </a>
                    </li>
                    <li>
                        <FaFacebook className="inline-block mr-2 text-blue-600" />
                        Facebook:{" "}
                        <a
                            href="https://www.facebook.com/nguyen1thanh2304"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:underline"
                        >
                            https://www.facebook.com/nguyen1thanh2304
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
