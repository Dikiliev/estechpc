import { makeAutoObservable } from 'mobx';

class FavoritesStore {
    favoritesItemCount: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setFavoritesCount = (count: number) => {
        this.favoritesItemCount = count;
    };

    addToFavorites(count: number = 1) {
        this.favoritesItemCount += count;
    }

    removeFromFavorites(count: number = 1) {
        this.favoritesItemCount = Math.max(this.favoritesItemCount - count, 0);
    }

    clearFavorites() {
        this.favoritesItemCount = 0;
    }
}

const favoritesStore = new FavoritesStore();
export default favoritesStore;
