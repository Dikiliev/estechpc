import { useState, useCallback } from 'react';

interface PriceRange {
    min: number;
    max: number;
}

interface Filters {
    [key: string]: string[];
}

export const useProductFilters = () => {
    // Состояние для выбранных фильтров и диапазона цен
    const [selectedFilters, setSelectedFilters] = useState<Filters>({});
    const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 0 });

    // Обновление фильтров
    const updateFilters = useCallback((newFilters: Filters) => {
        setSelectedFilters(newFilters);
    }, []);

    // Обновление диапазона цен
    const updatePriceRange = useCallback((newPriceRange: PriceRange) => {
        setPriceRange(newPriceRange);
    }, []);

    return {
        selectedFilters,
        priceRange,
        updateFilters,
        updatePriceRange,
    };
};
