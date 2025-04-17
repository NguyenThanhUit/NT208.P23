"use client";
import { useEffect, useState } from "react";
import qs from "query-string";
import { Order, PageResult } from ".";

import ProductList from "./components/ProductList";
import SearchFilterBar from "./Paginations/SearchFilterBar";
import { useParamStore } from "./hooks/useParamStore";
import { useShallow } from "zustand/shallow";
import { getData } from "./app/actions/orderactions";

export default function Homepage() {
    const [data, setData] = useState<PageResult<Order> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const params = useParamStore(useShallow(state => ({
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        pageCount: state.pageCount,
        searchTerm: state.searchTerm,
        orderBy: state.orderBy,
        seller: state.Seller,
        buyer: state.Buyer
    })));

    const setParams = useParamStore(state => state.setParams);

    const url = qs.stringify({ url: '', query: params });

    useEffect(() => {
        setLoading(true);
        setError(null);
        console.log("Request URL:", url);  // In ra URL để kiểm tra
        getData(url).then(data => {
            console.log("Fetched Data:", data);  // In ra dữ liệu đã fetch
            setData(data);
            setLoading(false);
        })
            .catch(err => {
                setError('Lỗi khi tải dữ liệu');
                setLoading(false);
            });
    }, [url, setData]);

    return (
        <div>
            <div className="bg-white">
                <SearchFilterBar />
            </div>
            <main className="bg-white w-full min-h-screen p-4 flex">
                {loading && <p className="text-center text-gray-500">Đang tải sản phẩm...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {/* Kiểm tra nếu có data và results trước khi lấy length */}
                {data?.results && data.results.length > 0 ? (
                    <ProductList orders={data.results} />
                ) : (
                    !loading && !error && <p className="text-center text-gray-500">Không có sản phẩm nào.</p>
                )}
            </main>
        </div>
    );
}
