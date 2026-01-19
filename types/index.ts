export interface Country {
    id: string;
    name: string;
    code: string;
    flag: string;
    regions: Region[];
}

export interface Region {
    id: string;
    name: string;
    countryId: string;
    coordinates: [number, number];
    popularActivities: ActivityCategory[];
}

export type ActivityCategory =
    | 'hotel'
    | 'breakfast'
    | 'lunch'
    | 'dinner'
    | 'cafe'
    | 'temple'
    | 'museum'
    | 'park'
    | 'shopping'
    | 'nightlife'
    | 'attraction'
    | 'culture';

export interface Activity {
    id: string;
    name: string;
    category: ActivityCategory;
    duration: number; // in minutes
    rating: number;
    priceLevel: number; // 1-4
    estimatedCost?: number;
    imageUrl: string;
    externalUrl: string;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    description: string;
    regionId: string;
    tags: string[];
}

export interface TimeSlot {
    id: string;
    time: string; // Format: "HH:MM"
    activity?: Activity;
}

export interface DayItinerary {
    dayNumber: number;
    date?: string;
    region: Region;
    timeSlots: TimeSlot[];
}

export interface TripState {
    selectedCountry: Country | null;
    selectedRegion: Region | null;
    numberOfDays: number;
    dailyItineraries: DayItinerary[];
    currentDay: number;
    startDate: string | null;
    totalBudget: number;
    currency: string;
    selectedDestinations?: Activity[];
    optimizedRoute?: Activity[];
}
