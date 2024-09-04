import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToFavorites, fetchFavorites, removeFromFavorites } from '@api/favorites';
import { fetchLocalFavorites, addLocalFavorite, removeLocalFavorite, clearLocalFavorites } from '@api/favoritesLocal';
import { rootStore } from '@src/stores';
import { IFavoritesList } from 'types/favorites';
import { fetchProductsByIds } from '@api/products';

export const FAVORITES_QUERY = ['favorites'];

export const useFavorites = (invalidateQueries: unknown[][] = [['products']]) => {
    const {
        authStore: { isAuthenticated },
    } = rootStore;

    const queryClient = useQueryClient();

    // Получение данных избранного
    const fetchFullFavorites = async (): Promise<IFavoritesList> => {
        if (isAuthenticated) {
            return fetchFavorites();
        } else {
            const localFavorites = fetchLocalFavorites();
            const productIds = localFavorites.map((item) => item.product.id);
            const products = await fetchProductsByIds(productIds);

            const items = products.map((product) => {
                const favoriteItem = localFavorites.find((item) => item.product.id === product.id);
                return {
                    id: product.id,
                    product,
                    created_at: favoriteItem ? favoriteItem.created_at : new Date().toISOString(),
                };
            });

            return {
                id: 0,
                items: items,
                updated_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
            };
        }
    };

    const {
        data: favoritesList,
        isLoading,
        isError,
    } = useQuery({
        queryKey: FAVORITES_QUERY,
        queryFn: fetchFullFavorites,
    });

    // Мутации для управления избранными товарами
    const addToFavoritesMutation = useMutation<void, Error, number>({
        mutationFn: async (productId) => {
            if (isAuthenticated) {
                await addToFavorites(productId);
            } else {
                addLocalFavorite(productId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY });
            invalidateQueries.forEach((q) => {
                queryClient.invalidateQueries({ queryKey: q });
            });
        },
    });

    const removeFromFavoritesMutation = useMutation<void, Error, number>({
        mutationFn: async (productId) => {
            if (isAuthenticated) {
                await removeFromFavorites(productId);
            } else {
                removeLocalFavorite(productId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY });
            invalidateQueries.forEach((q) => {
                queryClient.invalidateQueries({ queryKey: q });
            });
        },
    });

    const toggleFavorite = (productId: number, isFavorite: boolean) => {
        if (isFavorite) {
            removeFromFavoritesMutation.mutate(productId);
        } else {
            addToFavoritesMutation.mutate(productId);
        }
    };

    // Синхронизация локальных избранных товаров с сервером
    const syncLocalFavoritesToServer = useMutation<void, Error, void>({
        mutationFn: async () => {
            const localFavorites = fetchLocalFavorites();

            for (const item of localFavorites) {
                await addToFavorites(item.product.id);
            }

            clearLocalFavorites();
            queryClient.invalidateQueries({ queryKey: ['favorites'] }); // Обновляем избранное на клиенте
        },
        onError: (error) => {
            console.error('Ошибка синхронизации локальных избранных товаров:', error);
        },
    });

    return {
        favoritesList,
        isLoading,
        isError,
        toggleFavorite,
        isAdding: addToFavoritesMutation.isPending,
        isRemoving: removeFromFavoritesMutation.isPending,
        syncLocalFavoritesToServer: syncLocalFavoritesToServer.mutate,
    };
};
