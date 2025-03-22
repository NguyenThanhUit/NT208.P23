import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useParamStore } from "@/hooks/useParamStore";

export default function SearchFilterBar() {
    const setParams = useParamStore((state) => state.setParams);
    const searchValue = useParamStore((state) => state.searchValue);
    const setSearchValue = useParamStore((state) => state.setSearchValue);

    // Order By
    const orderButtons = [
        { label: "New", value: "new" },
        { label: "Price ascending", value: "priceascending" },
        { label: "Price descending", value: "pricedescending" },
    ];

    // State để lưu trạng thái filter đang chọn
    const [selectedFilter, setSelectedFilter] = useState(orderButtons[0].value);

    // Khi component mount, đặt giá trị mặc định cho orderBy
    useEffect(() => {
        setParams({ orderBy: orderButtons[0].value });
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
            {/* Ô tìm kiếm */}
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

            {/* Order By */}
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
        </div>
    );
}
