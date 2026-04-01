'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { wishlistService } from '@/services/wishlist.service';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
    tourId: string;
    initialIsInWishlist?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({
    tourId,
    initialIsInWishlist = false,
    className = '',
    size = 'md',
}: WishlistButtonProps) {
    const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/signin');
            return;
        }

        setIsLoading(true);
        try {
            if (isInWishlist) {
                await wishlistService.removeFromWishlist(tourId);
                setIsInWishlist(false);
            } else {
                await wishlistService.addToWishlist(tourId);
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`
                ${sizeClasses[size]}
                rounded-full bg-white shadow-md
                flex items-center justify-center
                transition-all duration-300
                hover:scale-110 hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart
                size={iconSizes[size]}
                className={`
                    transition-colors duration-300
                    ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                `}
            />
        </button>
    );
}
