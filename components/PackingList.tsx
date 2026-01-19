'use client';

import { useTripStore } from '@/lib/store';
import { Briefcase, CheckSquare, Square, X } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function PackingList() {
    const { dailyItineraries, selectedRegion } = useTripStore();
    const [isOpen, setIsOpen] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    // Generate list logic
    const packingList = useMemo(() => {
        if (!selectedRegion) return [];

        const items = new Set<string>();

        // Essentials
        items.add('Passport & ID');
        items.add('Phone Charger & Power Bank');
        items.add('Universal Adapter');
        items.add('Toiletries');
        items.add('Underwear & Socks');

        // Analyze activities
        let hasTemple = false;
        let hasWalking = false;
        let hasSwimming = false;
        let hasNightlife = false;
        let hasRain = false; // Could integrate weather API later

        dailyItineraries.forEach(day => {
            day.timeSlots.forEach(slot => {
                if (!slot.activity) return;
                const cat = slot.activity.category;

                if (['temple', 'culture'].includes(cat)) hasTemple = true;
                if (['park', 'shopping', 'attraction'].includes(cat)) hasWalking = true;
                if (['nightlife', 'dinner'].includes(cat)) hasNightlife = true;
                if (cat === 'hotel' && slot.activity.description.toLowerCase().includes('pool')) hasSwimming = true;
            });
        });

        if (hasTemple) {
            items.add('Modest clothing (covers shoulders/knees)');
            items.add('Slip-on shoes (for temples)');
        }
        if (hasWalking) {
            items.add('Comfortable walking shoes');
            items.add('Small backpack/daypack');
        }
        if (hasNightlife) items.add('Dressy outfit for evening');
        if (hasSwimming) items.add('Swimwear');

        // Region specific
        if (selectedRegion.countryId === 'japan') items.add('Hand towel (for restrooms)');
        if (selectedRegion.countryId === 'thailand') items.add('Mosquito repellent');
        if (selectedRegion.countryId === 'uk') items.add('Umbrella/Rain jacket'); // Example

        return Array.from(items).sort();

    }, [dailyItineraries, selectedRegion]);

    const toggleItem = (item: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    if (dailyItineraries.length === 0) return null;

    return (
        <>
            {/* Float Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/50 hover:scale-110 transition-transform flex items-center gap-2"
                title="View Smart Packing List"
            >
                <Briefcase className="w-6 h-6" />
                <span className="font-medium hidden md:inline">Packing List</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="bg-slate-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col items-stretch relative border border-white/10 shadow-2xl animate-fade-in">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-800">
                            <div>
                                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary-400" />
                                    Smart Packing List
                                </h3>
                                <p className="text-sm text-gray-400">Generated based on your itinerary</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto custom-scrollbar">
                            <div className="space-y-2">
                                {packingList.map((item) => (
                                    <div
                                        key={item}
                                        onClick={() => toggleItem(item)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border border-transparent transition-all cursor-pointer ${checkedItems[item]
                                                ? 'bg-primary-500/10 border-primary-500/20 opacity-60'
                                                : 'hover:bg-white/5 border-white/5'
                                            }`}
                                    >
                                        <div className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${checkedItems[item] ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-500 text-transparent'
                                            }`}>
                                            <CheckSquare className="w-4 h-4" />
                                        </div>
                                        <span className={`text-sm font-medium ${checkedItems[item] ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {packingList.length === 0 && (
                                <p className="text-center text-gray-500 my-8">
                                    Add activities to generate a list!
                                </p>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/10 bg-slate-800 text-center">
                            <p className="text-xs text-gray-500">
                                {Object.values(checkedItems).filter(Boolean).length} / {packingList.length} items packed
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
