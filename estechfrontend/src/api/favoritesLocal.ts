import { ILocalFavorite } from 'types/favorites';

const LOCAL_FAVORITES_KEY = 'local_favorites';

export const fetchLocalFavorites = (): ILocalFavorite[] => {
    const storedFavorites = localStorage.getItem(LOCAL_FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
};

export const addLocalFavorite = (productId: number) => {
    const favorites = fetchLocalFavorites();
    const updatedFavorites = [...favorites, { product: { id: productId }, created_at: new Date().toISOString() }];
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(updatedFavorites));
};

export const removeLocalFavorite = (productId: number) => {
    let favorites = fetchLocalFavorites();
    favorites = favorites.filter((item) => item.product.id !== productId);
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites));
};

export const clearLocalFavorites = () => {
    localStorage.removeItem(LOCAL_FAVORITES_KEY);
};
