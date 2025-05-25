import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useParamStore } from "@/hooks/useParamStore";
import { Button, ButtonGroup } from "flowbite-react";

export default function SearchFilterBar() {
    const setParams = useParamStore((state) => state.setParams);
    const searchValue = useParamStore((state) => state.searchValue);
    const setSearchValue = useParamStore((state) => state.setSearchValue);
    const pageSize = useParamStore((state) => state.pageSize);
    const orderBy = useParamStore(state => state.orderBy);

    const orderButtons = [
        { label: "New", value: "new" },
        { label: "Giá tăng dần", value: "priceascending" },
        { label: "Giá giảm dần", value: "pricedescending" },
    ];
    const pageSizeButtons = [12, 16, 20];

    const [selectedFilter, setSelectedFilter] = useState(orderBy || orderButtons[0].value);

    // Đồng bộ selectedFilter với orderBy khi orderBy thay đổi
    useEffect(() => {
        setSelectedFilter(orderBy);
    }, [orderBy]);

    useEffect(() => {
        // Khởi tạo orderBy nếu chưa có
        if (!orderBy) {
            setParams({ orderBy: orderButtons[0].value });
        }
    }, []);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setSearchValue(value);
        setParams({ searchTerm: value });
    }

    function handleFilterChange(value: string) {
        setSelectedFilter(value);
        setParams({ orderBy: value });
    }

    return (
        <div className="flex items-center justify-between p-4">
            {/* Search input */}
            <div className="relative flex items-center w-64">
                <Search className="absolute left-3 h-4 w-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchValue}
                    onChange={onChange}
                    className="text-black border rounded-full pl-10 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
            </div>

            {/* Order By buttons */}
            <div className="flex space-x-4">
                {orderButtons.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => handleFilterChange(value)}
                        className={`px-4 py-2 text-sm rounded-lg transition ${selectedFilter === value
                                ? "bg-black text-white"
                                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Page size buttons */}
            <div>
                <span className='uppercase text-sm text-gray-500 mr-2'>Page size</span>
                <ButtonGroup>
                    {pageSizeButtons.map((value, i) => (
                        <Button
                            key={i}
                            onClick={() => setParams({ pageSize: value })}
                            color={`${pageSize === value ? "red" : "gray"}`}
                            className="focus:ring-0"
                        >
                            {value}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
        </div>
    );
}
