'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ChevronRight, ChevronDown, MoveUp, MoveDown, Save, RefreshCcw, ExternalLink } from 'lucide-react';
import { settingsService } from '@/services/settings.service';
import { yatrasService } from '@/services/yatras.service';
import Preloader from '@/components/shared/Preloader';
import { MenuItem } from '@/data/menu';

export default function NavigationEditorPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [expandedPaths, setExpandedPaths] = useState<string[]>([]);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const [data, yatrasData] = await Promise.all([
                settingsService.getSetting('header_navigation'),
                yatrasService.getAllYatras({ isActive: true })
            ]);

            let baseMenu: MenuItem[] = [];
            if (data && Array.isArray(data.value)) {
                baseMenu = data.value;
            }

            // Merge dynamic yatras into the menu structure for visibility in admin
            const mergedMenu = mergeYatrasIntoMenu(baseMenu, yatrasData || []);
            setMenuItems(mergedMenu);
        } catch (error) {
            console.error('Failed to fetch menu:', error);
            setMessage({ type: 'error', text: 'Failed to load navigation menu.' });
        } finally {
            setLoading(false);
        }
    };

    const mergeYatrasIntoMenu = (menu: MenuItem[], yatras: any[]) => {
        const newMenu = JSON.parse(JSON.stringify(menu)) as MenuItem[];
        const toursMenu = newMenu.find(item => item.label === 'Tours & Packages');
        if (!toursMenu || !toursMenu.children) return newMenu;

        yatras.forEach(yatra => {
            const categoryLabel = (yatra.category || 'Pilgrimage Yatra Packages').trim();
            const yatraItem: MenuItem = { label: yatra.title, href: `/yatras/${yatra.slug}` };

            let categoryGroup = toursMenu.children?.find(child => child.label.trim().toLowerCase() === categoryLabel.toLowerCase());

            if (categoryGroup) {
                if (!categoryGroup.children) categoryGroup.children = [];
                
                const exists = categoryGroup.children.some(child => {
                    if (child.href === yatraItem.href) return true;
                    if (child.href && yatra.slug && child.href.split('/').pop() === yatra.slug) return true;
                    if (child.label.trim().toLowerCase() === yatraItem.label.trim().toLowerCase()) return true;
                    return false;
                });

                if (!exists) {
                    categoryGroup.children.push(yatraItem);
                }
            }
        });

        return newMenu;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsService.upsertSetting('header_navigation', menuItems, 'Main header navigation menu structure');
            setMessage({ type: 'success', text: 'Navigation menu saved successfully!' });
        } catch (error) {
            console.error('Failed to save menu:', error);
            setMessage({ type: 'error', text: 'Failed to save navigation menu.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const addItem = (parentId?: string) => {
        const newItem: MenuItem = { label: 'New Item', href: '' };
        
        if (!parentId) {
            setMenuItems([...menuItems, newItem]);
            return;
        }

        const updatedMenu = [...menuItems];
        const addRecursive = (items: MenuItem[], path: string) => {
            for (let i = 0; i < items.length; i++) {
                const currentId = `${path}-${i}`;
                if (currentId === parentId) {
                    if (!items[i].children) items[i].children = [];
                    items[i].children?.push(newItem);
                    return true;
                }
                if (items[i].children && addRecursive(items[i].children!, currentId)) {
                    return true;
                }
            }
            return false;
        };
        
        addRecursive(updatedMenu, 'root');
        setMenuItems(updatedMenu);
    };

    const deleteItem = (path: string) => {
        const updatedMenu = [...menuItems];
        
        const deleteRecursive = (items: MenuItem[], currentPath: string): MenuItem[] => {
            return items.filter((_, index) => {
                const itemPath = `${currentPath}-${index}`;
                if (itemPath === path) return false;
                return true;
            }).map((item, index) => {
                const itemPath = `${currentPath}-${index}`;
                if (item.children) {
                    return { ...item, children: deleteRecursive(item.children, itemPath) };
                }
                return item;
            });
        };

        if (path.startsWith('root-') && !path.includes('-', 5)) {
             // Top level delete
             const index = parseInt(path.split('-')[1]);
             setMenuItems(menuItems.filter((_, i) => i !== index));
        } else {
             setMenuItems(deleteRecursive(updatedMenu, 'root'));
        }
    };

    const updateItem = (path: string, field: keyof MenuItem, value: any) => {
        const updatedMenu = [...menuItems];
        const updateRecursive = (items: MenuItem[], currentPath: string) => {
            for (let i = 0; i < items.length; i++) {
                const itemPath = `${currentPath}-${i}`;
                if (itemPath === path) {
                    (items[i] as any)[field] = value;
                    return true;
                }
                if (items[i].children && updateRecursive(items[i].children!, itemPath)) {
                    return true;
                }
            }
            return false;
        };

        updateRecursive(updatedMenu, 'root');
        setMenuItems(updatedMenu);
    };

    const moveItem = (path: string, direction: 'up' | 'down') => {
        const updatedMenu = [...menuItems];
        
        const moveRecursive = (items: MenuItem[], currentPath: string): boolean => {
            for (let i = 0; i < items.length; i++) {
                const itemPath = `${currentPath}-${i}`;
                if (itemPath === path) {
                    const newIndex = direction === 'up' ? i - 1 : i + 1;
                    if (newIndex >= 0 && newIndex < items.length) {
                        const temp = items[i];
                        items[i] = items[newIndex];
                        items[newIndex] = temp;
                    }
                    return true;
                }
                if (items[i].children && moveRecursive(items[i].children!, itemPath)) {
                    return true;
                }
            }
            return false;
        };

        moveRecursive(updatedMenu, 'root');
        setMenuItems(updatedMenu);
    };

    const toggleExpand = (path: string) => {
        setExpandedPaths(prev => 
            prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
        );
    };

    const renderMenuItems = (items: MenuItem[], path: string, depth = 0) => {
        return items.map((item, index) => {
            const currentPath = `${path}-${index}`;
            const isExpanded = expandedPaths.includes(currentPath);
            const hasChildren = item.children && item.children.length > 0;

            return (
                <div key={currentPath} className="mb-2">
                    <div className={`flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-saffron/30 transition-all ${depth > 0 ? 'ml-8' : ''}`}>
                        <div className="flex items-center gap-1 min-w-[30px]">
                            {item.children ? (
                                <button onClick={() => toggleExpand(currentPath)} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                            ) : (
                                <div className="w-6" />
                            )}
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                value={item.label} 
                                onChange={(e) => updateItem(currentPath, 'label', e.target.value)}
                                className="px-3 py-1.5 border border-gray-200 rounded text-sm focus:border-saffron outline-none font-semibold text-deepBlue"
                                placeholder="Item Label"
                            />
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={item.href || ''} 
                                    onChange={(e) => updateItem(currentPath, 'href', e.target.value)}
                                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:border-saffron outline-none text-gray-600"
                                    placeholder="Link (/destination, https://...)"
                                />
                                {item.href && (
                                    <a href={item.href} target="_blank" className="p-2 text-gray-400 hover:text-saffron">
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <label className="flex items-center gap-1 mr-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={item.mobileOnly || false} 
                                    onChange={(e) => updateItem(currentPath, 'mobileOnly', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-saffron"
                                />
                                <span className="text-[10px] uppercase font-bold text-gray-400">Mobile Only</span>
                            </label>
                            <label className="flex items-center gap-1 mr-4 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={item.isHidden || false} 
                                    onChange={(e) => updateItem(currentPath, 'isHidden', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-saffron"
                                />
                                <span className="text-[10px] uppercase font-bold text-gray-400">Hidden</span>
                            </label>

                            <div className="flex border-l pl-2 gap-1">
                                <button onClick={() => moveItem(currentPath, 'up')} className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Move Up"><MoveUp size={14} /></button>
                                <button onClick={() => moveItem(currentPath, 'down')} className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Move Down"><MoveDown size={14} /></button>
                                <button onClick={() => addItem(currentPath)} className="p-1.5 hover:bg-green-50 text-green-600 rounded" title="Add Child"><Plus size={14} /></button>
                                <button onClick={() => deleteItem(currentPath)} className="p-1.5 hover:bg-red-50 text-red-600 rounded" title="Delete"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>

                    {isExpanded && item.children && (
                        <div className="mt-2">
                            {renderMenuItems(item.children, currentPath, depth + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };

    if (loading) {
        return (
            <div className="p-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <Preloader fullScreen={false} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-deepBlue flex items-center gap-3">
                        Header Navigation Settings
                    </h1>
                    <p className="text-gray-500 mt-2">Manage your website's main menu links, dropdowns and hierarchy.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchMenu} 
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-all"
                    >
                        <RefreshCcw size={18} />
                        Discard Changes
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className={`flex items-center gap-2 px-6 py-2.5 bg-saffron text-white rounded-lg font-bold shadow-lg shadow-saffron/20 hover:scale-[1.02] transition-all ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Navigation'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <div className={`h-2 w-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-semibold">{message.text}</span>
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                    <h2 className="text-lg font-bold text-deepBlue">Menu Structure</h2>
                    <button 
                        onClick={() => addItem()} 
                        className="flex items-center gap-2 px-4 py-2 bg-deepBlue text-white rounded-lg text-sm font-bold hover:bg-deepBlue/90 transition-all"
                    >
                        <Plus size={16} />
                        Add Top-Level Item
                    </button>
                </div>

                <div className="space-y-3">
                    {menuItems.length > 0 ? (
                        renderMenuItems(menuItems, 'root')
                    ) : (
                        <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium italic">No menu items found. Click 'Add Top-Level Item' to begin.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Important Note
                </h3>
                <p className="text-amber-700 text-sm leading-relaxed">
                    Changes made here will reflect globally in the header. For the <strong>Tours & Packages</strong> section, the system automatically injects your active Yatras into their respective categories, so you don't need to manually add every single yatra link here unless you want a custom order.
                </p>
            </div>
        </div>
    );
}
