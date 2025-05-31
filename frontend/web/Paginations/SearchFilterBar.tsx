import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useParamStore } from "@/hooks/useParamStore";
import { Button, ButtonGroup, Dropdown } from "flowbite-react";

export default function SearchFilterBar() {
    const setParams = useParamStore((state) => state.setParams);
    const searchValue = useParamStore((state) => state.searchValue);
    const setSearchValue = useParamStore((state) => state.setSearchValue);
    const pageSize = useParamStore((state) => state.pageSize);
    const orderBy = useParamStore((state) => state.orderBy);
    const filterBy = useParamStore((state) => state.filterBy);

    const orderOptions = [
        { label: "Mới nhất", value: "new" },
        { label: "Giá tăng dần", value: "priceascending" },
        { label: "Giá giảm dần", value: "pricedescending" },
    ];

    const filterOptions = [
        "Action", "Adventure", "RPG", "Simulation", "Strategy",
        "Sports", "Puzzle", "Racing", "Horror", "Shooter"
    ];

    const pageSizeButtons = [12, 16, 20];

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        setParams({ searchTerm: value });
    };

    const selectedOrderLabel = orderOptions.find((opt) => opt.value === orderBy)?.label || "Mới nhất";
    const selectedFilterLabel = filterBy || "Tất cả";

    return (
        <div className="p-4 bg-white rounded-md shadow-sm border space-y-4">
            {/* Row 1: Search - Filter - Order */}
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                {/* Search */}
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchValue}
                        onChange={onChange}
                        className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm text-black focus:ring-2 focus:ring-red-300 focus:outline-none"
                    />
                </div>

                {/* Filter */}
                <Dropdown
                    label={
                        <span className="text-sm font-medium text-gray-700">
                            🎮 Thể loại: <span className="text-black">{selectedFilterLabel}</span>
                        </span>
                    }
                    color="gray"
                    dismissOnClick={true}
                >
                    {filterOptions.map((genre) => (
                        <Dropdown.Item
                            key={genre}
                            onClick={() => setParams({ filterBy: genre })}
                            className={`${filterBy === genre ? "text-red-600 font-semibold" : ""}`}
                        >
                            {genre}
                        </Dropdown.Item>
                    ))}
                    <Dropdown.Item
                        onClick={() => setParams({ filterBy: "" })}
                        className={`${!filterBy ? "text-red-600 font-semibold" : ""}`}
                    >
                        Tất cả
                    </Dropdown.Item>
                </Dropdown>

                {/* Order */}
                <Dropdown
                    label={
                        <span className="text-sm font-medium text-gray-700">
                            🔽 Sắp xếp: <span className="text-black">{selectedOrderLabel}</span>
                        </span>
                    }
                    color="gray"
                    dismissOnClick={true}
                >
                    {orderOptions.map(({ label, value }) => (
                        <Dropdown.Item
                            key={value}
                            onClick={() => setParams({ orderBy: value })}
                            className={`${orderBy === value ? "text-red-600 font-semibold" : ""}`}
                        >
                            {label}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            </div>

            {/* Row 2: Page Size */}
            <div className="flex items-center justify-end gap-2">
                <span className="text-sm text-gray-600 font-medium">Số sản phẩm mỗi trang:</span>
                <ButtonGroup>
                    {pageSizeButtons.map((value) => (
                        <Button
                            key={value}
                            onClick={() => setParams({ pageSize: value })}
                            color={pageSize === value ? "red" : "gray"}
                            size="sm"
                            className="focus:ring-0 rounded-full"
                        >
                            {value}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
        </div>
    );
}
