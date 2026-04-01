'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { cartService } from '@/services/cart.service';

export default function CartIcon({ useDarkTheme = true }: { useDarkTheme?: boolean }) {
    const [itemCount, setItemCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCartCount();

        // Refresh cart count every 30 seconds
        const interval = setInterval(fetchCartCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchCartCount = async () => {
        try {
            // const token = localStorage.getItem('token');
            // if (!token) {
            //     setItemCount(0);
            //     setIsLoading(false);
            //     return;
            // }

            const cart = await cartService.getCart();
            setItemCount(cart.itemCount || 0);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setItemCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    // Show even if not authenticated
    if (isLoading) return null;

    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // if (!token) return null;

    return (
        <Link
            href="/cart"
            className={`relative p-2 rounded-full transition-colors ${useDarkTheme ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
            aria-label="Shopping Cart"
        >
            <ShoppingCart size={24} className={useDarkTheme ? 'text-gray-700' : 'text-white'} />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5722] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {itemCount > 9 ? '9+' : itemCount}
                </span>
            )}
        </Link>
    );
}
