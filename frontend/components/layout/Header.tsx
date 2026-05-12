'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Heart, ChevronDown, ChevronRight } from 'lucide-react';
import CartIcon from '@/components/layout/CartIcon';
import { menuItems, MenuItem } from '@/data/menu';
import { yatrasService } from '@/services/yatras.service';
import { settingsService } from '@/services/settings.service';

export default function Header({ isEmbedded = false }: { isEmbedded?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [expandedMobileItems, setExpandedMobileItems] = useState<string[]>([]);
    const [yatras, setYatras] = useState<any[]>([]);
    const [dynamicMenu, setDynamicMenu] = useState<MenuItem[]>(menuItems);
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/auth');

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                // Fetch active yatras for dynamic menu injection
                const yatrasData = await yatrasService.getAllYatras({ isActive: true });
                if (yatrasData) {
                    setYatras(yatrasData);
                }

                // Fetch dynamic menu from settings
                const settingsData = await settingsService.getSetting('header_navigation');
                if (settingsData && Array.isArray(settingsData.value)) {
                    setDynamicMenu(settingsData.value);
                }
            } catch (err) {
                console.error("Failed to fetch header data:", err);
            }
        };

        fetchHeaderData();
    }, []);

    useEffect(() => {
        // Check if user is logged in — runs on every path change
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, [pathname]);

    useEffect(() => {
        // Define paths that should have a transparent header initially
        const transparentHeaderPaths = [
            '/',
            '/contact',
            '/yatras'
        ];

        // Check if current path matches any transparent header path
        const isTransparentHeader = transparentHeaderPaths.some(path => {
            // For /yatras, only allow exact match (listing pages) to be transparent
            if (path === '/yatras' && pathname !== path) {
                return false;
            }
            return pathname === path || (path !== '/' && pathname?.startsWith(path));
        });

        if (!isTransparentHeader) {
            setIsScrolled(true);
            return;
        }

        // Reset scroll state when changing paths/initial load for transparent headers
        setIsScrolled(window.scrollY > 50);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    const toggleMobileItem = (label: string) => {
        setExpandedMobileItems(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    // Determine effective style state
    const useDarkTheme = isScrolled || isAuthPage;

    // Recursive helper for Desktop Dropdowns (Level 2+)
    const renderDesktopSubMenu = (items: MenuItem[], depth = 0) => {
        const isMain = depth === 0;
        const isL1 = depth === 1;
        const hasChildren = items.some(item => item.children && item.children.length > 0);

        return (
            <div className={`absolute ${isMain ? 'top-full left-0 min-w-[260px] border-t-4 border-saffron translate-y-2 group-hover/main:opacity-100 group-hover/main:visible group-hover/main:translate-y-0' : `left-full top-0 min-w-[280px] ml-1 translate-x-2 ${isL1 ? 'group-hover/l1:opacity-100 group-hover/l1:visible group-hover/l1:translate-x-0' : 'group-hover/l2:opacity-100 group-hover/l2:visible group-hover/l2:translate-x-0'}`} bg-white shadow-2xl rounded-lg opacity-0 invisible transition-all duration-300 transform z-50`}>
                <div className={`py-2 ${!hasChildren ? 'max-h-[65vh] overflow-y-auto custom-scrollbar' : ''}`}>
                    {items.map((child, idx) => (
                        <div key={idx} className={`relative ${isMain ? 'group/l1' : isL1 ? 'group/l2' : 'group/l3'}`}>
                            {child.children ? (
                                <>
                                    <div className={`px-4 py-2.5 hover:bg-orange-50 hover:text-saffron flex items-center justify-between cursor-pointer ${isMain ? 'text-deepBlue font-semibold' : 'text-sm text-gray-700 font-medium'}`}>
                                        <span className="whitespace-nowrap pr-6">{child.label}</span>
                                        <ChevronRight size={14} className="flex-shrink-0 text-gray-400" />
                                    </div>
                                    {renderDesktopSubMenu(child.children, depth + 1)}
                                </>
                            ) : (
                                <Link
                                    href={child.href || '#'}
                                    className={`block px-4 py-2.5 hover:bg-orange-50 hover:text-saffron transition-colors whitespace-nowrap ${isMain ? 'text-deepBlue font-medium' : 'text-sm text-gray-700'}`}
                                >
                                    {child.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Merge Yatras into MenuItems dynamically
    const getDynamicMenuItems = () => {
        // Deep copy menu items so we don't mutate the original array
        const baseMenu = JSON.parse(JSON.stringify(dynamicMenu)) as MenuItem[];

        const filterHidden = (items: MenuItem[]): MenuItem[] => {
            return items.filter(item => !item.isHidden).map(item => {
                if (item.children) {
                    item.children = filterHidden(item.children);
                }
                return item;
            });
        };

        const visibleBaseMenu = filterHidden(baseMenu);

        // Find "Tours & Packages" main menu item in the COPIED menu
        const toursMenu = visibleBaseMenu.find(item => item.label === 'Tours & Packages');
        if (!toursMenu || !toursMenu.children) return visibleBaseMenu;

        yatras.forEach(yatra => {
            const categoryLabel = (yatra.category || 'Pilgrimage Yatra Packages').trim();
            const yatraItem: MenuItem = { label: yatra.title, href: `/yatras/${yatra.slug}` };

            // Find the matching category group inside "Tours & Packages"
            let categoryGroup = toursMenu.children?.find(child => child.label.trim().toLowerCase() === categoryLabel.toLowerCase());

            if (categoryGroup) {
                if (!categoryGroup.children) categoryGroup.children = [];
                
                // Robust duplicate detection to prevent items showing twice
                const alreadyExists = categoryGroup.children.some(child => {
                    // 1. Exact href match
                    if (child.href === yatraItem.href) return true;
                    
                    // 2. Slug match (handles /tours/ vs /yatras/ vs /package/ prefixes)
                    if (child.href && yatra.slug) {
                        const childSlug = child.href.split('/').pop();
                        if (childSlug === yatra.slug) return true;
                    }
                    
                    // 3. Label match (case-insensitive, trimmed)
                    if (child.label.trim().toLowerCase() === yatraItem.label.trim().toLowerCase()) return true;

                    return false;
                });

                if (!alreadyExists) {
                    categoryGroup.children.push(yatraItem);
                }
            }
        });

        return visibleBaseMenu;
    };


    const currentMenuItems = getDynamicMenuItems();

    // Recursive helper for Desktop Dropdowns
    const renderDesktopMenuItem = (item: MenuItem) => {
        if (item.mobileOnly) return null;

        const hasChildren = item.children && item.children.length > 0;

        if (hasChildren) {
            return (
                <div key={item.label} className="relative group/main cursor-pointer z-50">
                    <div className={`flex items-center gap-1 font-medium transition-colors py-4 ${pathname?.startsWith(item.href || '#')
                        ? 'text-saffron'
                        : useDarkTheme
                            ? 'text-deepBlue hover:text-saffron'
                            : 'text-white hover:text-gold'
                        }`}>
                        {item.label}
                        <ChevronDown size={16} className="transition-transform group-hover/main:rotate-180" />
                    </div>

                    {/* Dropdown Menu */}
                    {item.children && renderDesktopSubMenu(item.children, 0)}
                </div>
            );
        }

        return (
            <Link
                key={item.label}
                href={item.href || '#'}
                className={`font-medium transition-colors ${pathname === item.href
                    ? 'text-saffron'
                    : useDarkTheme
                        ? 'text-deepBlue hover:text-saffron'
                        : 'text-white hover:text-gold'
                    }`}
            >
                {item.label}
            </Link>
        );
    };

    // Helper for Mobile Menu Items
    const renderMobileMenuItem = (item: MenuItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMobileItems.includes(item.label);

        if (hasChildren) {
            return (
                <div key={item.label} className="w-full">
                    <button
                        onClick={() => toggleMobileItem(item.label)}
                        className={`flex items-center justify-between w-full py-2 text-left font-medium text-deepBlue hover:text-saffron`}
                        style={{ paddingLeft: `${depth === 0 ? 0 : 1}rem` }}
                    >
                        {item.label}
                        <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pl-4 border-l-2 border-gray-100 ml-2 space-y-2 py-2">
                            {item.children?.map(child => renderMobileMenuItem(child, depth + 1))}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Link
                key={item.label}
                href={item.href || '#'}
                className="block py-2 text-deepBlue hover:text-saffron font-medium"
                style={{ paddingLeft: `${depth === 0 ? 0 : 1}rem` }}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                {item.label}
            </Link>
        );
    };

    return (
        <header
            className={`${isEmbedded ? 'w-full' : 'fixed top-0 left-0 right-0 z-50'} transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <img
                            src={useDarkTheme ? "/vt-logo-retina-black.png" : "/vt-logo-retina.png"}
                            alt="Vedic Travel"
                            className="h-5 md:h-6 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        {currentMenuItems.map(renderDesktopMenuItem)}
                    </nav>

                    {/* Auth Buttons & Cart/Wishlist */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <div className="flex items-center space-x-2 mr-2">
                            {isLoggedIn && (
                                <Link
                                    href="/dashboard?tab=wishlist"
                                    className={`p-2 rounded-full transition-colors ${useDarkTheme ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/10 text-white'}`}
                                    aria-label="Wishlist"
                                >
                                    <Heart size={24} />
                                </Link>
                            )}
                            <CartIcon useDarkTheme={useDarkTheme} />
                        </div>

                        {/* Book Now Button */}
                        <Link href="/contact" className="btn-primary !py-2 !px-6 text-sm whitespace-nowrap shadow-md hover:shadow-lg hover:-translate-y-0.5">
                            Book Now
                        </Link>

                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                className={`font-medium ${useDarkTheme ? 'text-deepBlue hover:text-saffron' : 'text-white hover:text-gold'
                                    }`}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className={`font-medium ${useDarkTheme ? 'text-deepBlue hover:text-saffron' : 'text-white hover:text-gold'
                                        }`}
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <CartIcon useDarkTheme={useDarkTheme} />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2"
                        >
                            <svg
                                className={`w-6 h-6 ${useDarkTheme ? 'text-deepBlue' : 'text-white'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg text-gray-900 max-h-[80vh] overflow-y-auto">
                        <nav className="flex flex-col space-y-2 p-4">
                            {currentMenuItems.map(item => renderMobileMenuItem(item))}

                            <Link
                                href="/contact"
                                className="btn-primary w-full text-center mt-4"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Book Now
                            </Link>

                            <div className="border-t border-gray-100 my-2 pt-2"></div>

                            {isLoggedIn && (
                                <Link
                                    href="/dashboard?tab=wishlist"
                                    className="flex items-center gap-2 text-deepBlue hover:text-saffron font-medium py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Heart size={20} />
                                    My Wishlist
                                </Link>
                            )}

                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    className="text-deepBlue hover:text-saffron font-medium py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/signin"
                                        className="text-deepBlue hover:text-saffron font-medium py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="text-deepBlue hover:text-saffron font-medium py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
