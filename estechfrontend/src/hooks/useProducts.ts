import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts } from '@api/products';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Filters, Range } from 'types/productFilters';

export const useProducts = (categoryID: number, selectedFilters: Filters, priceRange: Range) => {
    const { ref, inView } = useInView();

    const productsQuery = ['products', categoryID, selectedFilters, priceRange];

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: productsLoading,
        isError: productsError,
    } = useInfiniteQuery({
        queryKey: productsQuery,
        queryFn: ({ pageParam = 1 }) => fetchProducts(categoryID, selectedFilters, priceRange, pageParam),
        getNextPageParam: (lastPage) => {
            const nextUrl = lastPage.next;
            if (nextUrl) {
                const urlParams = new URLSearchParams(nextUrl.split('?')[1]);
                return urlParams.get('page') ? parseInt(urlParams.get('page')!) : undefined;
            }
            return undefined;
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    return {
        ref,
        products: data?.pages.flatMap((page) => page.results) || [],
        isFetchingNextPage,
        productsLoading,
        productsError,
    };
};
