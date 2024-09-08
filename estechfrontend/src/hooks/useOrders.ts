import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, createOrder } from 'src/api/orders';
import { IOrder, IOrderCreateData } from 'src/types/order';
import { PaginatedResponse } from 'types/common';

const ORDERS_QUERY_KEY = 'orders';

export const useOrders = (page: number) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery<PaginatedResponse<IOrder>, Error>({
        queryKey: [ORDERS_QUERY_KEY, page], // Передаем страницу в ключе
        queryFn: () => fetchOrders(page),
    });

    const createOrderMutation = useMutation<IOrderCreateData, Error, IOrderCreateData>({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
        },
    });

    const totalPages = data?.total_pages || 1;
    const orders = data?.results || [];

    return {
        orders,
        isLoading,
        isError,
        error,
        totalPages,
        createOrder: createOrderMutation.mutateAsync,
    };
};
