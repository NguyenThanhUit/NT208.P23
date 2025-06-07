'use client'
import { signIn } from "next-auth/react";
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function LoginButton() {
    return (
        <div className="flex justify-center">
            <button
                onClick={() => signIn('id-server', { callbackUrl: '/', prompt: 'login' })}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500
                           text-white font-semibold rounded-lg shadow-lg hover:brightness-110 transition duration-300 ease-in-out
                           active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-400"
            >
                <FaUserCircle size={20} />
                ĐĂNG NHẬP / ĐĂNG KÝ
            </button>
        </div>
    )
}
