import { makeAutoObservable } from 'mobx';

class CartStore {
    cartItemCount: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setCartItemCount = (count: number) => {
        this.cartItemCount = count;
    };

    addToCart(count: number = 1) {
        this.cartItemCount += count;
    }

    removeFromCart(count: number = 1) {
        this.cartItemCount = Math.max(this.cartItemCount - count, 0);
    }

    clearCart() {
        this.cartItemCount = 0;
    }
}

const cartStore = new CartStore();
export default cartStore;
