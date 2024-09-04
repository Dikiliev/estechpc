import { IProduct } from 'types/products';

export interface IFavoritesList {
    id: number;
    items: IFavorite[];
    updated_at: string;
    created_at: string;
}

export interface IFavorite {
    id: number;
    product: IProduct;
    created_at: string;
}

export interface ILocalFavorite {
    product: { id: number };
    created_at: string;
}
