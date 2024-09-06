// types/cart.ts
import { IProduct } from 'types/products';

// Интерфейс для элемента корзины в локальном хранилище
export interface ILocalCartItem {
    product: { id: number }; // Храним только id продукта
    quantity: number;
    is_selected: boolean;
}

export interface ILocalCart {
    items: ILocalCartItem[];
}

export interface ICartItem {
    id: number;
    product: IProduct;
    quantity: number;
    is_selected: boolean;
}

export interface ICart {
    id: number;
    items: ICartItem[];
    total_amount: number;
}
