import apiClient from '../lib/api-client';

export interface CartItem {
    tour: any;
    quantity: number;
    travelDate: string;
    priceSnapshot: number;
    addedAt: string;
}

export interface Cart {
    _id?: string;
    user?: string;
    items: CartItem[];
    total: number;
    itemCount: number;
    lastUpdated?: string;
}

const GUEST_CART_KEY = 'guest_cart';

const getGuestCart = (): Cart => {
    if (typeof window === 'undefined') return { items: [], total: 0, itemCount: 0 };
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : { items: [], total: 0, itemCount: 0 };
};

const saveGuestCart = (cart: Cart) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

export const cartService = {
    addToCart: async (tour: any, quantity: number, travelDate: string) => {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await apiClient.post('/cart/add', {
                tourId: tour._id,
                quantity,
                travelDate,
            });
            return response.data;
        } else {
            const cart = getGuestCart();
            const existingItem = cart.items.find(item => item.tour._id === tour._id && item.travelDate === travelDate);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({
                    tour,
                    quantity,
                    travelDate,
                    priceSnapshot: tour.price,
                    addedAt: new Date().toISOString()
                });
            }

            cart.total = cart.items.reduce((acc, item) => acc + (item.tour.price * item.quantity), 0);
            cart.itemCount = cart.items.length;
            saveGuestCart(cart);
            return cart;
        }
    },

    getCart: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await apiClient.get('/cart');
                return response.data;
            } catch (error) {
                // If token invalid, fall back to guest cart
                return getGuestCart();
            }
        }
        return getGuestCart();
    },

    getCartTotal: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await apiClient.get('/cart/total');
            return response.data;
        }
        const cart = getGuestCart();
        return { total: cart.total, itemCount: cart.itemCount };
    },

    updateCartItem: async (itemIndex: number, quantity?: number, travelDate?: string) => {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await apiClient.patch(`/cart/items/${itemIndex}`, {
                quantity,
                travelDate,
            });
            return response.data;
        } else {
            const cart = getGuestCart();
            if (cart.items[itemIndex]) {
                if (quantity !== undefined) cart.items[itemIndex].quantity = quantity;
                if (travelDate !== undefined) cart.items[itemIndex].travelDate = travelDate;
            }
            cart.total = cart.items.reduce((acc, item) => acc + (item.tour.price * item.quantity), 0);
            saveGuestCart(cart);
            return cart;
        }
    },

    removeCartItem: async (itemIndex: number) => {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await apiClient.delete(`/cart/items/${itemIndex}`);
            return response.data;
        } else {
            const cart = getGuestCart();
            cart.items.splice(itemIndex, 1);
            cart.total = cart.items.reduce((acc, item) => acc + (item.tour.price * item.quantity), 0);
            cart.itemCount = cart.items.length;
            saveGuestCart(cart);
            return cart;
        }
    },

    clearCart: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await apiClient.delete('/cart/clear');
            return response.data;
        } else {
            localStorage.removeItem(GUEST_CART_KEY);
            return { items: [], total: 0, itemCount: 0 };
        }
    },
};
