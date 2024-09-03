// src/stores/rootStore.ts
import authStore from './authStore';
import cartStore from './cartStore';
import favoritesStore from './favoritesStore';

class RootStore {
    authStore = authStore;

    cartStore = cartStore;
    favoritesStore = favoritesStore;
}

const rootStore = new RootStore();
export default rootStore;
