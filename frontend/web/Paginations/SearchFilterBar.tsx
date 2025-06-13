import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useParamStore } from "@/hooks/useParamStore";
import { Button, ButtonGroup, Dropdown } from "flowbite-react";
import { debounce } from "lodash";

export default function SearchFilterBar() {
    const { setParams, searchValue, setSearchValue, pageSize, orderBy, filterBy, minPrice, maxPrice } = useParamStore();
    const priceOptions = [
        { label: "Tất cả giá", min: null, max: null },
        { label: "Dưới 1 triệu", min: null, max: 1_000_000 },
        { label: "1 - 5 triệu", min: 1_000_000, max: 5_000_000 },
        { label: "5 - 10 triệu", min: 5_000_000, max: 10_000_000 },
        { label: "Trên 10 triệu", min: 10_000_000, max: null },
    ];
    const orderOptions = [
        { label: "Mới nhất", value: "new" },
        { label: "Giá tăng dần", value: "priceascending" },
        { label: "Giá giảm dần", value: "pricedescending" },
    ];
    const filterOptions = [
        "Action",
        "Adventure",
        "RPG",
        "Simulation",
        "Strategy",
        "Sports",
        "Puzzle",
        "Racing",
        "Horror",
        "Shooter",
    ];

    const pageSizeButtons = [12, 16, 20];

    // Debounce search input
    const debouncedSearch = debounce((value: string) => {
        setParams({ searchTerm: value });
    }, 300);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        debouncedSearch(value);
    };

    const clearFilters = () => {
        setSearchValue("");
        setParams({ searchTerm: "", filterBy: "", orderBy: "new", pageSize: 12 });
    };

    const selectedOrderLabel = orderOptions.find((opt) => opt.value === orderBy)?.label || "Mới nhất";
    const selectedFilterLabel = filterBy || "Tất cả";
    const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = parseInt(e.target.value);
        const selected = priceOptions[index];
        setParams({ minPrice: selected.min, maxPrice: selected.max });
    };

    const getSelectedIndex = () => {
        return priceOptions.findIndex(
            (opt) => opt.min === minPrice && opt.max === maxPrice
        );
    };
    return (
        <div className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6 max-w-full mx-auto transition-all">
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">

                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-12 pr-10 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                    {searchValue && (
                        <X
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300 cursor-pointer"
                            onClick={() => {
                                setSearchValue("");
                                setParams({ searchTerm: "" });
                            }}
                        />
                    )}
                </div>


                <Dropdown
                    label={
                        <span className="text-base font-semibold text-gray-700 dark:text-gray-200 select-none">
                            🎮 Thể loại: <span className="text-red-600 dark:text-red-400 font-bold">{selectedFilterLabel}</span>
                        </span>
                    }
                    color="light"
                    dismissOnClick={true}
                    className="min-w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                >
                    <div className="max-h-60 overflow-y-auto">
                        {filterOptions.map((genre) => (
                            <Dropdown.Item
                                key={genre}
                                onClick={() => setParams({ filterBy: genre })}
                                className={`text-base py-2 px-4 ${filterBy === genre
                                    ? "text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/20"
                                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {genre}
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Item
                            onClick={() => setParams({ filterBy: "" })}
                            className={`text-base py-2 px-4 ${!filterBy
                                ? "text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/20"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            Tất cả
                        </Dropdown.Item>
                    </div>
                </Dropdown>


                <Dropdown
                    label={
                        <span className="text-base font-semibold text-gray-700 dark:text-gray-200 select-none">
                            🔽 Sắp xếp: <span className="text-red-600 dark:text-red-400 font-bold">{selectedOrderLabel}</span>
                        </span>
                    }
                    color="light"
                    dismissOnClick={true}
                    className="min-w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                >
                    {orderOptions.map(({ label, value }) => (
                        <Dropdown.Item
                            key={value}
                            onClick={() => setParams({ orderBy: value })}
                            className={`text-base py-2 px-4 ${orderBy === value
                                ? "text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/20"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                        >
                            {label}
                        </Dropdown.Item>
                    ))}
                </Dropdown>


                <Button
                    onClick={clearFilters}
                    color="gray"
                    size="sm"
                    className="rounded-lg px-4 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
                >
                    <X className="h-5 w-5 mr-2" />
                    Xóa bộ lọc
                </Button>
            </div>


            <div className="flex items-center justify-end gap-4 select-none">
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                    Số sản phẩm mỗi trang:
                </span>
                <ButtonGroup>
                    {pageSizeButtons.map((value) => (
                        <Button
                            key={value}
                            onClick={() => setParams({ pageSize: value })}
                            color={pageSize === value ? "red" : "gray"}
                            size="sm"
                            className={`rounded-full px-5 transition-all ${pageSize === value
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                        >
                            {value}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
            <div className="flex items-center gap-4 py-2">
                <label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Lọc theo giá:
                </label>
                <select
                    id="price"
                    className="border border-gray-300 px-3 py-1 rounded-md shadow-sm text-sm"
                    value={getSelectedIndex()}
                    onChange={handlePriceChange}
                >
                    {priceOptions.map((option, idx) => (
                        <option key={idx} value={idx}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}