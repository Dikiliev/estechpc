import { IProduct } from 'types/products';

export interface IFavorite {
    id: number;
    product: IProduct;
    created_at: string;
}

export interface ILocalFavorite {
    product: { id: number };
    created_at: string;
}
