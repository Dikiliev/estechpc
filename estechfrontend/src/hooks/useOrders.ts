import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, createOrder } from 'src/api/orders';
import { IOrder, IOrderCreateData } from 'src/types/order';
import { PaginatedResponse } from 'types/common';

const ORDERS_QUERY_KEY = 'orders';

// Хук для получения заказов
export const useOrders = ({ page }: { page: number }) => {
    const { data, isLoading, isError, error } = useQuery<PaginatedResponse<IOrder>, Error>({
        queryKey: [ORDERS_QUERY_KEY, page], // Передаем страницу в ключе
        queryFn: () => fetchOrders(page),
        staleTime: 5000,
    });

    const totalPages = data?.total_pages || 1;
    const orders = data?.results || [];

    return {
        orders,
        isLoading,
        isError,
        error,
        totalPages,
    };
};

// Хук для создания заказа
export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation<IOrderCreateData, Error, IOrderCreateData>({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
        },
    });
};
