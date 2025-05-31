"use client";
import { useEffect, useState } from "react";
import qs from "query-string";

import ProductList from "./components/ProductList";
import SearchFilterBar from "./Paginations/SearchFilterBar";
import { useParamStore } from "./hooks/useParamStore";
import { useShallow } from "zustand/shallow";
import { getData } from "./app/actions/orderactions";
import { useOrderStore } from "./hooks/useOrderStore";
import AppPagination from "./components/AppPagination";



export default function Homepage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { order, totalCount, pageCount } = useOrderStore(
        useShallow(state => ({
            order: state.orders,
            totalCount: state.totalCount,
            pageCount: state.pageCount
        }))
    )

    const setData = useOrderStore(state => state.setData);

    const params = useParamStore(useShallow(state => ({
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        pageCount: state.pageCount,
        searchTerm: state.searchTerm,
        orderBy: state.orderBy,
        seller: state.Seller,
        filterBy: state.filterBy,
        buyer: state.Buyer
    })));

    const setParams = useParamStore(state => state.setParams);

    const url = '?' + qs.stringify(params);
    console.log("Current url fetch:", url);


    function setPageNumber(pageNumber: number) {
        setParams({ pageNumber });
    }

    useEffect(() => {
        setLoading(true);
        setError(null);
        console.log("Request URL:", url);

        getData(url).then(data => {
            console.log("Fetched data (raw):", data.results.map(d => ({ id: d.id, Price: d.Price })));
            setData(data);
            setLoading(false);
        }).catch(err => {
            setError('Lỗi khi tải dữ liệu');
            setLoading(false);
        });
    }, [url, setData]);


    return (
        <div>
            <div className="bg-white">
                <SearchFilterBar />
            </div>
            <main className="bg-white w-full min-h-screen p-4 flex-col">
                {loading && <p className="text-center text-gray-500">Đang tải sản phẩm...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}


                {order && order.length > 0 ? (
                    <ProductList orders={order} />
                ) : (
                    !loading && !error && <p className="text-center text-gray-500">Không có sản phẩm nào.</p>
                )}

                <div className='flex justify-center mt-4'>
                    <AppPagination
                        pageChanged={setPageNumber}
                        currentPage={params.pageNumber}
                        pageCount={pageCount}
                    />
                </div>
            </main>
        </div>
    );
}
