'use client';

import { useTripStore } from '@/lib/store';
import { Sparkles, CalendarCheck, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OptimizedImportControls() {
    const {
        selectedDestinations,
        numberOfDays,
        generateSuggestions,
        importOptimizedRoute,
        optimizedRoute
    } = useTripStore();
    const router = useRouter();
    const [isImporting, setIsImporting] = useState(false);

    const handleImport = async () => {
        if (confirm("This will overwrite your current main itinerary. Are you sure?")) {
            setIsImporting(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Fake nice delay
            importOptimizedRoute();
            router.push('/');
        }
    };

    return (
        <div className="glass p-6 rounded-xl space-y-4 animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">3. Finalize & Export</h3>

            {/* Analysis Text */}
            <div className="text-sm text-gray-400 mb-4">
                You have <strong>{selectedDestinations.length}</strong> items for a <strong>{numberOfDays}</strong> day trip.
                {selectedDestinations.length / numberOfDays < 2 ? (
                    <span className="text-orange-400 block mt-1">That's a bit empty! Try suggesting more.</span>
                ) : (
                    <span className="text-green-400 block mt-1">Looks like a good pace!</span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={generateSuggestions}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-sm"
                >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Suggest More
                </button>

                <button
                    onClick={handleImport}
                    disabled={optimizedRoute.length === 0 || isImporting}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isImporting ? (
                        'Importing...'
                    ) : (
                        <>
                            <CalendarCheck className="w-4 h-4" />
                            Import to Planner
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
