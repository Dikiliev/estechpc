// src/types/order.ts

import { IProduct } from 'types/products';

export interface IOrder {
    id: number;

    address: string;

    contact_method: string;
    contact_method_display: string;
    contact_info: string;

    delivery_method: string;
    delivery_method_display: string;

    status: string;
    status_display: string;

    items: IOrderItem[];
    price: number;

    created_at: string;
    updated_at: string;
}

export interface IOrderCreateData {
    address?: string;

    contact_method: string;
    contact_info: string;
    delivery_method: string;

    items: IOrderItemCreateData[];
}

export interface IOrderItemCreateData {
    product: number;
    quantity: number;
}

export interface IOrderItem {
    id: number;
    product: IProduct;
    quantity: number;
    total_price: number;
}
