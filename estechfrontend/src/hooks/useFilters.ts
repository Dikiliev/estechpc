import { useQuery } from '@tanstack/react-query';
import { fetchFilters, FiltersResponse } from '@api/products';

export const useFilters = (categoryID: number) => {
    const {
        data: filtersResponse,
        isLoading: filtersLoading,
        isError: filtersError,
    } = useQuery<FiltersResponse>({
        queryKey: ['filters', categoryID],
        queryFn: () => fetchFilters(categoryID),
    });

    return {
        filters: filtersResponse?.filters,
        filtersLoading,
        filtersError,
    };
};
