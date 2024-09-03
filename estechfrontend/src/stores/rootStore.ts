// src/stores/rootStore.ts
import authStore from './authStore';

class RootStore {
    authStore = authStore;

    // Здесь можно добавить другие stores
    // например, productStore = new ProductStore(this);
}

const rootStore = new RootStore();
export default rootStore;
