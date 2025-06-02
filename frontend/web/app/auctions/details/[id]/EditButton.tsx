'use client';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import React from 'react';

type Props = { id: string };

export default function EditButton({ id }: Props) {
    return (
        <Link href={`/auctions/update/${id}`}>
            <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-200"
            >
                Update Auction
            </button>

        </Link>
    );
}
