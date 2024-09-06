// api/cartLocal.ts

import { ILocalCart } from 'types/cart';

const CART_KEY = 'localCart';

// Получение корзины из localStorage
export const fetchLocalCart = (): ILocalCart => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : { items: [] };
};

// Сохранение корзины в localStorage
const saveLocalCart = (cart: ILocalCart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Добавление товара в локальную корзину
export const addProductToLocalCart = (productId: number, quantity: number = 1) => {
    const cart = fetchLocalCart();
    const existingItem = cart.items.find((item) => item.product.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({ product: { id: productId }, quantity, is_selected: true });
    }

    saveLocalCart(cart);
};

// Обновление количества товара в локальной корзине
export const updateLocalCartItem = (itemId: number, quantity: number) => {
    const cart = fetchLocalCart();
    const item = cart.items.find((item) => item.product.id === itemId);

    if (item) {
        item.quantity = quantity;
        saveLocalCart(cart);
    }
};

// Удаление товара из локальной корзины
export const removeProductFromLocalCart = (itemId: number) => {
    const cart = fetchLocalCart();
    cart.items = cart.items.filter((item) => item.product.id !== itemId);
    saveLocalCart(cart);
};

// Очистка локальной корзины
export const clearLocalCart = () => {
    localStorage.removeItem(CART_KEY);
};

// Обновление статуса выбора (is_selected) товара в локальной корзине
export const updateLocalCartItemSelection = (itemId: number, isSelected: boolean) => {
    const cart = fetchLocalCart();
    const item = cart.items.find((item) => item.product.id === itemId);

    if (item) {
        item.is_selected = isSelected;
        saveLocalCart(cart);
    }
};

// Удаление всех выбранных товаров из локальной корзины
export const removeSelectedLocalCartItems = () => {
    const cart = fetchLocalCart();
    cart.items = cart.items.filter((item) => !item.is_selected);
    saveLocalCart(cart);
};

// Массовое обновление товаров в локальной корзине (для обновления количества или is_selected)
export const bulkUpdateLocalCartItems = (items: { item_id: number; quantity?: number; is_selected?: boolean }[]) => {
    const cart = fetchLocalCart();

    items.forEach(({ item_id, quantity, is_selected }) => {
        const item = cart.items.find((item) => item.product.id === item_id);

        if (item) {
            if (quantity !== undefined) {
                item.quantity = quantity;
            }
            if (is_selected !== undefined) {
                item.is_selected = is_selected;
            }
        }
    });

    saveLocalCart(cart);
};
