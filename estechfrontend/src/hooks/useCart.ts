import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCart, addProductToCart, updateCartItem, removeProductFromCart, clearCart } from '@api/cart';
import { fetchLocalCart, addProductToLocalCart, updateLocalCartItem, removeProductFromLocalCart, clearLocalCart } from '@api/cartLocal';
import { ICart, ICartItem } from 'types/cart';
import { useAuthStore } from '@stores/auth';
import { fetchProductsByIds } from '@api/products';

export const useCart = () => {
    const queryClient = useQueryClient();
    const [isLoggedIn] = useAuthStore((state) => [state.isLoggedIn, state.user]);
    const isAuthenticated = isLoggedIn();

    // Получение данных корзины
    const fetchFullCart = async (): Promise<ICart> => {
        if (isAuthenticated) {
            return fetchCart();
        } else {
            const localCart = fetchLocalCart();
            const productIds = localCart.items.map((item) => item.product.id);
            const products = await fetchProductsByIds(productIds);

            const fullItems = localCart.items
                .map((item): ICartItem | null => {
                    const product = products.find((product) => product.id === item.product.id);
                    if (!product) {
                        console.error(`Product with ID ${item.product.id} not found`);
                        return null;
                    }
                    return { ...item, id: product.id, product };
                })
                .filter((item): item is ICartItem => item !== null);

            return {
                id: 0,
                items: fullItems,
                total_amount: fullItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0),
            };
        }
    };

    // Хук для запроса корзины
    const {
        data: cart,
        isLoading: isLoadingCart,
        isError: isErrorCart,
        error: error,
    } = useQuery<ICart>({
        queryKey: ['cart'],
        queryFn: fetchFullCart,
    });

    // Мутации для управления корзиной
    const addProductToCartMutation = useMutation<void, Error, { productId: number; quantity: number }>({
        mutationFn: async ({ productId, quantity }) => {
            if (isAuthenticated) {
                await addProductToCart(productId, quantity);
            } else {
                addProductToLocalCart(productId, quantity);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const updateCartItemMutation = useMutation<void, Error, { itemId: number; quantity: number }>({
        mutationFn: async ({ itemId, quantity }) => {
            if (isAuthenticated) {
                await updateCartItem(itemId, quantity);
            } else {
                updateLocalCartItem(itemId, quantity);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const removeProductFromCartMutation = useMutation<void, Error, number>({
        mutationFn: async (itemId) => {
            if (isAuthenticated) {
                await removeProductFromCart(itemId);
            } else {
                removeProductFromLocalCart(itemId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const clearCartMutation = useMutation<void, Error, void>({
        mutationFn: async () => {
            if (isAuthenticated) {
                await clearCart();
            } else {
                clearLocalCart();
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    return {
        cart,
        isLoadingCart,
        isErrorCart,
        error,
        addProductToCart: addProductToCartMutation.mutate,
        updateCartItem: updateCartItemMutation.mutate,
        removeProductFromCart: removeProductFromCartMutation.mutate,
        clearCart: clearCartMutation.mutate,
        isAdding: addProductToCartMutation.isPending,
        isUpdating: updateCartItemMutation.isPending,
        isRemoving: removeProductFromCartMutation.isPending,
        isClearing: clearCartMutation.isPending,
    };
};
