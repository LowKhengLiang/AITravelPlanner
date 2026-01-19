'use client';

import { Country, Region } from '@/types';
import { Globe, MapPin } from 'lucide-react';

interface CountrySelectorProps {
    countries: Country[];
    selectedCountry: Country | null;
    selectedRegion: Region | null;
    onCountryChange: (country: Country) => void;
    onRegionChange: (region: Region) => void;
}

export default function CountrySelector({
    countries,
    selectedCountry,
    selectedRegion,
    onCountryChange,
    onRegionChange,
}: CountrySelectorProps) {
    return (
        <>
            {/* Country Selector */}
            <div className="flex-1 min-w-[250px]">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Globe className="w-4 h-4" />
                    Select Country
                </label>
                <select
                    value={selectedCountry?.id || ''}
                    onChange={(e) => {
                        const country = countries.find((c) => c.id === e.target.value);
                        if (country) onCountryChange(country);
                    }}
                    className="w-full px-4 py-3 rounded-lg glass border border-white/10 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
                >
                    <option value="" disabled className="bg-slate-800">
                        Choose your destination...
                    </option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id} className="bg-slate-800">
                            {country.flag} {country.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Region Selector */}
            {selectedCountry && (
                <div className="flex-1 min-w-[250px] animate-slide-up">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4" />
                        Select Region
                    </label>
                    <select
                        value={selectedRegion?.id || ''}
                        onChange={(e) => {
                            const region = selectedCountry.regions.find((r) => r.id === e.target.value);
                            if (region) onRegionChange(region);
                        }}
                        className="w-full px-4 py-3 rounded-lg glass border border-white/10 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
                    >
                        <option value="" disabled className="bg-slate-800">
                            Choose a region...
                        </option>
                        {selectedCountry.regions.map((region) => (
                            <option key={region.id} value={region.id} className="bg-slate-800">
                                {region.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </>
    );
}
