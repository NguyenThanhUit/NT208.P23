"use client";
import { useEffect, useState } from "react";
import qs from "query-string";
import { Order, PageResult } from ".";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import { getData } from "./actions/fetchData";
import SearchFilterBar from "./Paginations/SearchFilterBar";
import { useParamStore } from "./hooks/useParamStore";
import { useShallow } from "zustand/shallow";

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

    const queryParams = qs.stringify(params);

    function setPageNumber(pageNumber: number) {
        setParams({ pageNumber });
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getData(queryParams);
                console.log("Fetched data:", result);
                setData(result);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Không thể tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [queryParams]);

    return (
        <div>
            <Navbar />
            <div className="bg-white">
                <SearchFilterBar />
            </div>
            <main className="bg-white w-full min-h-screen p-4 flex">
                {loading && <p className="text-center text-gray-500">Đang tải sản phẩm...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {data?.results?.length ? (
                    <ProductList orders={data.results} />
                ) : (
                    !loading && !error && <p className="text-center text-gray-500">Không có sản phẩm nào.</p>
                )}
            </main>
            <Footer />
        </div>
    );
}
