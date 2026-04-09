'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, PackageOpen } from 'lucide-react';
import { cartService, Cart as CartType } from '@/services/cart.service';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Preloader from '@/components/shared/Preloader';

export default function CartPage() {
    const [cart, setCart] = useState<CartType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await cartService.getCart();
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateItem = async (index: number, quantity?: number, travelDate?: string) => {
        try {
            const updatedCart = await cartService.updateCartItem(index, quantity, travelDate);
            setCart(updatedCart);
        } catch (error) {
            console.error('Error updating cart item:', error);
            alert('Failed to update item');
        }
    };

    const handleRemoveItem = async (index: number) => {
        if (!confirm('Remove this item from cart?')) return;

        try {
            const updatedCart = await cartService.removeCartItem(index);
            setCart(updatedCart);
        } catch (error) {
            console.error('Error removing cart item:', error);
            alert('Failed to remove item');
        }
    };

    const handleClearCart = async () => {
        if (!confirm('Clear all items from cart?')) return;

        try {
            await cartService.clearCart();
            setCart({ items: [], total: 0, itemCount: 0 } as CartType);
        } catch (error) {
            console.error('Error clearing cart:', error);
            alert('Failed to clear cart');
        }
    };

    if (isLoading) {
        return <Preloader />;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white rounded-2xl shadow-lg p-12">
                            <PackageOpen className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
                            <p className="text-gray-600 mb-8">
                                Looks like you haven't added any spiritual journeys to your cart yet.
                            </p>
                            <button
                                onClick={() => router.push('/tours')}
                                className="bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#F4511E] hover:to-[#FF7043] transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                            >
                                Explore Tours
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <ShoppingBag className="w-8 h-8 text-[#FF5722]" />
                        <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
                    </div>
                    <p className="text-gray-600">
                        {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item, index) => (
                            <CartItem
                                key={index}
                                item={item}
                                index={index}
                                onUpdate={handleUpdateItem}
                                onRemove={handleRemoveItem}
                            />
                        ))}

                        {/* Clear Cart Button */}
                        <button
                            onClick={handleClearCart}
                            className="w-full bg-white border-2 border-red-500 text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {/* Cart Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary cart={cart} />
                    </div>
                </div>
            </div>
        </div>
    );
}
