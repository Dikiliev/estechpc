// types/cart.ts
import { IProduct } from 'types/products';

// Интерфейс для элемента корзины в локальном хранилище, хранящий только id продукта
export interface ILocalCartItem {
    product: { id: number }; // Храним только id продукта
    quantity: number;
}

// Интерфейс для корзины в локальном хранилище
export interface ILocalCart {
    items: ILocalCartItem[];
}

export interface ICartItem {
    id: number;
    product: IProduct;
    quantity: number;
}

export interface ICart {
    id: number;
    items: ICartItem[];
    total_amount: number;
}
