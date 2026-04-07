'use client';

import { useState, useEffect } from 'react';
import { settingsService } from '@/services/settings.service';
import { toursService, Tour } from '@/services/tours.service';
import { Search, Plus, X, GripVertical, Save, Loader2 } from 'lucide-react';

export default function GlobalOthersChoosingSettings() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedTours, setSelectedTours] = useState<Tour[]>([]);
    const [searchResults, setSearchResults] = useState<Tour[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await settingsService.getSetting('global_others_choosing');
            if (data && data.value && Array.isArray(data.value)) {
                setSelectedIds(data.value);
                // Hydrate the tours
                if (data.value.length > 0) {
                    const response = await toursService.getAllTours({ ids: data.value, limit: 100 });
                    // Sort hydrated tours to match the order of IDs in the setting
                    const hydrated = (data.value as string[]).map((id: string) => response.tours.find((t: Tour) => t._id === id)).filter(Boolean) as Tour[];
                    setSelectedTours(hydrated);
                }
            }
        } catch (error) {
            console.error('Error fetching global choosing settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const response = await toursService.getAllTours({ search: term, limit: 10 });
            // Filter out already selected tours
            const filtered = response.tours.filter((t: Tour) => !selectedIds.includes(t._id));
            setSearchResults(filtered);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setSearching(false);
        }
    };

    const addTour = (tour: Tour) => {
        if (!selectedIds.includes(tour._id)) {
            const newIds = [...selectedIds, tour._id];
            const newTours = [...selectedTours, tour];
            setSelectedIds(newIds);
            setSelectedTours(newTours);
            setSearchResults(prev => prev.filter(t => t._id !== tour._id));
            setSearchTerm('');
            setSearchResults([]);
        }
    };

    const removeTour = (id: string) => {
        setSelectedIds(prev => prev.filter(i => i !== id));
        setSelectedTours(prev => prev.filter(t => t._id !== id));
    };

    const moveDown = (index: number) => {
        if (index === selectedTours.length - 1) return;
        const newTours = [...selectedTours];
        const newIds = [...selectedIds];
        
        [newTours[index], newTours[index + 1]] = [newTours[index + 1], newTours[index]];
        [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
        
        setSelectedTours(newTours);
        setSelectedIds(newIds);
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newTours = [...selectedTours];
        const newIds = [...selectedIds];
        
        [newTours[index], newTours[index - 1]] = [newTours[index - 1], newTours[index]];
        [newIds[index], newIds[index - 1]] = [newIds[index - 1], newIds[index]];
        
        setSelectedTours(newTours);
        setSelectedIds(newIds);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            await settingsService.upsertSetting(
                'global_others_choosing', 
                selectedIds, 
                'Global list of packages displayed in "Others are also choosing" section'
            );
            setMessage({ text: 'Settings saved successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ text: 'Error saving settings.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-saffron animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-deepBlue">"Others are also choosing" Section</h2>
                    <p className="text-sm text-gray-500 italic mt-1">Select up to 4-5 packages that will appear globally on all trip pages.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-saffron text-white px-6 py-2 rounded-lg font-bold hover:bg-saffron-dark transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 shadow-lg shadow-saffron/20"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Global List'}
                </button>
            </div>

            {message.text && (
                <div className={`mb-4 p-4 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-4 ${
                    message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Selection Area */}
                <div>
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="bg-deepBlue text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
                        Current Selection ({selectedTours.length})
                    </h3>
                    
                    <div className="space-y-3 min-h-[300px] bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
                        {selectedTours.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                                <Search className="w-12 h-12 text-gray-300 mb-3" />
                                <p className="text-gray-400 font-medium">No packages selected yet.</p>
                                <p className="text-xs text-gray-400">Search for packages on the right to add them.</p>
                            </div>
                        ) : (
                            selectedTours.map((tour, index) => (
                                <div key={tour._id} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-4 group hover:border-saffron/30 transition-all shadow-sm">
                                    <div className="flex flex-col gap-1">
                                        <button 
                                            onClick={() => moveUp(index)} 
                                            disabled={index === 0}
                                            className="text-gray-400 hover:text-saffron disabled:opacity-30 p-1"
                                        >
                                            <svg className="w-3 h-3 rotate-180" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </button>
                                        <button 
                                            onClick={() => moveDown(index)} 
                                            disabled={index === selectedTours.length - 1}
                                            className="text-gray-400 hover:text-saffron disabled:opacity-30 p-1"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </button>
                                    </div>
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                        {tour.images?.[0] && <img src={tour.images[0]} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-deepBlue text-sm truncate">{tour.title}</p>
                                        <p className="text-[10px] text-gray-500 flex items-center gap-2 uppercase tracking-tighter">
                                            <span>{tour.locations?.join(' • ')}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span>{tour.duration} Days</span>
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => removeTour(tour._id)}
                                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                        {selectedTours.length > 0 && selectedTours.length > 5 && (
                            <p className="text-amber-600 text-xs font-semibold px-2">Notice: Only the first 4-5 items may fit well in the UI.</p>
                        )}
                    </div>
                </div>

                {/* Search Area */}
                <div>
                     <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="bg-deepBlue text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
                        Search Packages
                    </h3>

                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Enter package name or destination..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all"
                        />
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {searching ? (
                            <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                <span>Searching...</span>
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((tour) => (
                                <div 
                                    key={tour._id} 
                                    className="p-3 border border-gray-100 rounded-xl flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                                    onClick={() => addTour(tour)}
                                >
                                     <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                        {tour.images?.[0] && <img src={tour.images[0]} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-deepBlue text-sm truncate">{tour.title}</p>
                                        <p className="text-[10px] text-gray-500 flex items-center gap-2 uppercase tracking-tighter">
                                            <span>{tour.locations?.join(' • ')}</span>
                                        </p>
                                    </div>
                                    <button className="text-saffron hover:text-saffron-dark p-2 bg-saffron/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        ) : searchTerm.length >= 2 ? (
                            <div className="py-12 text-center text-gray-400">
                                <p className="font-medium">No results found for "{searchTerm}"</p>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-gray-300">
                                <p className="text-sm italic">Type at least 2 characters to search.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
