'use client';

import React, { useEffect, useState } from 'react';


import { useShallow } from 'zustand/shallow';
import qs from 'query-string';
import { useAuctionStore } from '@/hooks/UseAuctionStore';
import { useParamStore } from '@/hooks/useParamStore';
import { getData } from '../actions/auctionaction';
import AppPagination from '@/components/AppPagination';
import { Auction } from '@/index';
import AuctionCard from '@/components/AuctionCard';
import EmptyFilter from '@/components/EmptyFilter';
import AuctionSearchFilterBar from '@/Paginations/AuctionSearchFilterBar';



export default function Listings() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Lấy dữ liệu từ Zustand store một cách ổn định
    const { auctions, totalCount, pageCount } = useAuctionStore(
        useShallow(state => ({
            auctions: state.auctions,
            totalCount: state.totalCount,
            pageCount: state.pageCount
        }))
    );

    const setData = useAuctionStore(state => state.setData);

    // Lấy tham số từ Zustand store
    const params = useParamStore(
        useShallow(state => ({
            pageNumber: state.pageNumber,
            pageSize: state.pageSize,
            pageCount: state.pageCount,
            searchTerm: state.searchTerm,
            orderBy: state.orderBy,
            filterBy: state.filterBy,
            seller: state.Seller,
            winner: state.winner
        }))
    );

    const setParams = useParamStore(state => state.setParams);

    // Tạo URL từ tham số
    const url = qs.stringifyUrl({ url: '', query: params });

    // Cập nhật số trang
    function setPageNumber(pageNumber: number) {
        setParams({ pageNumber });
    }

    // Fetch dữ liệu mỗi khi URL thay đổi
    useEffect(() => {
        setLoading(true);
        setError(null);

        getData(url)
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Lỗi khi tải dữ liệu.');
                setLoading(false);
            });
    }, [url, setData]);

    if (loading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    if (!auctions || totalCount === 0) return <EmptyFilter showReset />;

    return (
        <>
            <AuctionSearchFilterBar />
            <div className='grid grid-cols-4 gap-6'>
                {auctions.map((auction: Auction) => (
                    <AuctionCard auction={auction} key={auction.id} />
                ))}
            </div>
            <div className='flex justify-center mt-4'>
                <AppPagination
                    pageChanged={setPageNumber}
                    currentPage={params.pageNumber}
                    pageCount={pageCount}
                />
            </div>
        </>
    );
}
