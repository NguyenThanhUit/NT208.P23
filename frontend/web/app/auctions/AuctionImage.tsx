// 'use client' để đảm bảo component này được render phía client (Next.js)
'use client'
// Import React và useState hook để quản lý trạng thái tải ảnh
import React, { useState } from 'react'

// Import Image từ Next.js để tối ưu hóa hình ảnh
import Image from 'next/image'

// Định nghĩa kiểu Props cho component, yêu cầu prop imageUrl là một chuỗi (string)
type Props = {
    imageUrl: string
}

// Component CarImage nhận vào imageUrl và hiển thị  hình ảnh ô tô
export default function AuctionImage({ imageUrl }: Props) {
    const [isLoading, setLoading] = useState(true);

    return (
        <Image
            src={imageUrl}
            fill
            alt='image of items'
            priority
            className={`
                  object-cover group-hover:opacity-75 duration-700 ease-in-out
                  ${isLoading
                    ? 'grayscale blur-2xl scale-110'
                    : 'grayscale-0 blur-0 scale-100'}
              `}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
            onLoad={() => setLoading(false)}
        />
    )
}
