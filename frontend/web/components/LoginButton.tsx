'use client'
import { signIn } from "next-auth/react";
import React, { useState } from 'react'

export default function LoginButton() {

    return (
        <div>
            <button
                onClick={() => signIn('id-server', { callbackUrl: '/', prompt: 'login' })}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                ĐĂNG NHẬP/ĐĂNG KÝ
            </button>
        </div>
    )
}
