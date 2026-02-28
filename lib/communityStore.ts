import { create } from 'zustand';
import { CommunityPost, User } from '@/types';
import { TripState } from '@/types';
import { activities } from '@/data/mockData';

interface CommunityStore {
    posts: CommunityPost[];
    currentUser: User;

    // Actions
    publishPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'stats' | 'author'>) => void;
    toggleLike: (postId: string) => void;
    ratePost: (postId: string, rating: number) => void;
    importItinerary: (postId: string) => TripState | null;
    getPost: (postId: string) => CommunityPost | undefined;
}

// Mock Data
const MOCK_USER: User = {
    id: 'u1',
    name: 'Traveler Joe',
    avatar: '👨‍🚀',
    followers: 124,
    bio: 'Love exploring new cities and finding hidden gems.'
};

const tokyoActivities = activities.filter(a => a.regionId === 'tokyo');

const MOCK_POSTS: CommunityPost[] = [
    {
        id: 'p1',
        author: { id: 'u2', name: 'Sarah Jenkins', avatar: '👩‍🎨', followers: 850 },
        title: 'The Ultimate Tokyo Foodie Tour',
        content: `
# Tokyo is a food paradise! 🍜

Here is my 3-day itinerary focusing purely on the best eats in the city. From high-end sushi to hidden ramen shops.

## Highlights
- **Tsukiji Market**: Fresh seafood breakfast.
- **Omoide Yokocho**: Yakitori in a nostalgic alley.
- **Harajuku**: Crepes and cotton candy!

Enjoy!
        `,
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
        stats: { likes: 342, imports: 56, rating: 4.8, ratingCount: 45 },
        tags: ['Japan', 'Food', 'City'],
        createdAt: '2024-03-15T10:00:00Z',
        itinerarySnapshot: {
            selectedCountry: { id: 'jp', name: 'Japan', code: 'JP', flag: '🇯🇵', regions: [] },
            selectedRegion: { id: 'tokyo', name: 'Tokyo', countryId: 'jp', coordinates: [139.6503, 35.6762], popularActivities: [] },
            numberOfDays: 3,
            dailyItineraries: [
                {
                    dayNumber: 1,
                    date: '2024-05-01',
                    region: { id: 'tokyo', name: 'Tokyo', countryId: 'jp', coordinates: [139.6503, 35.6762], popularActivities: [] },
                    timeSlots: [
                        { id: '1-1', time: '09:00', activity: tokyoActivities[1] }, // Breakfast
                        { id: '1-2', time: '13:00', activity: tokyoActivities[3] }, // Lunch
                        { id: '1-3', time: '19:00', activity: tokyoActivities[6] }, // Dinner
                    ]
                },
                {
                    dayNumber: 2,
                    date: '2024-05-02',
                    region: { id: 'tokyo', name: 'Tokyo', countryId: 'jp', coordinates: [139.6503, 35.6762], popularActivities: [] },
                    timeSlots: [
                        { id: '2-1', time: '10:00', activity: tokyoActivities[2] }, // Temple
                        { id: '2-2', time: '14:00', activity: tokyoActivities[4] }, // Shopping
                    ]
                },
                {
                    dayNumber: 3,
                    date: '2024-05-03',
                    region: { id: 'tokyo', name: 'Tokyo', countryId: 'jp', coordinates: [139.6503, 35.6762], popularActivities: [] },
                    timeSlots: [
                        { id: '3-1', time: '11:00', activity: tokyoActivities[5] }, // Cafe
                        { id: '3-2', time: '20:00', activity: tokyoActivities[7] }, // Nightlife
                    ]
                }
            ],
            currentDay: 1,
            startDate: '2024-05-01',
            totalBudget: 2000,
            currency: 'USD',
            selectedDestinations: [],
            optimizedRoute: []
        }
    },
    {
        id: 'p2',
        author: { id: 'u3', name: 'Mike Trekker', avatar: '🧗', followers: 1200 },
        title: 'Kyoto Temples & Zen Gardens',
        content: 'A peaceful journey through the ancient capital. Perfect for recharging your soul.',
        coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        stats: { likes: 128, imports: 23, rating: 4.5, ratingCount: 12 },
        tags: ['Japan', 'History', 'Nature'],
        createdAt: '2024-03-20T14:30:00Z',
        itinerarySnapshot: {
            selectedCountry: { id: 'jp', name: 'Japan', code: 'JP', flag: '🇯🇵', regions: [] },
            selectedRegion: { id: 'kyoto', name: 'Kyoto', countryId: 'jp', coordinates: [135.7681, 35.0116], popularActivities: [] },
            numberOfDays: 1,
            dailyItineraries: [
                {
                    dayNumber: 1,
                    date: '2024-05-10',
                    region: { id: 'kyoto', name: 'Kyoto', countryId: 'jp', coordinates: [135.7681, 35.0116], popularActivities: [] },
                    timeSlots: []
                }
            ],
            currentDay: 1,
            startDate: '2024-05-10',
            totalBudget: 500,
            currency: 'USD',
            selectedDestinations: [],
            optimizedRoute: []
        }
    }
];

export const useCommunityStore = create<CommunityStore>((set, get) => ({
    posts: MOCK_POSTS,
    currentUser: MOCK_USER,

    publishPost: (draft) => {
        const newPost: CommunityPost = {
            ...draft,
            id: `p${Date.now()}`,
            author: get().currentUser,
            createdAt: new Date().toISOString(),
            stats: { likes: 0, imports: 0, rating: 0, ratingCount: 0 }
        };
        set(state => ({ posts: [newPost, ...state.posts] }));
    },

    toggleLike: (postId) => {
        set(state => ({
            posts: state.posts.map(post =>
                post.id === postId
                    ? { ...post, stats: { ...post.stats, likes: post.stats.likes + 1 } } // Simple toggle simulation
                    : post
            )
        }));
    },

    ratePost: (postId, rating) => {
        set(state => ({
            posts: state.posts.map(post => {
                if (post.id === postId) {
                    const newCount = post.stats.ratingCount + 1;
                    const newAvg = ((post.stats.rating * post.stats.ratingCount) + rating) / newCount;
                    return {
                        ...post,
                        stats: { ...post.stats, rating: newAvg, ratingCount: newCount }
                    };
                }
                return post;
            })
        }));
    },

    importItinerary: (postId) => {
        const post = get().posts.find(p => p.id === postId);
        if (post) {
            // Increment import count
            set(state => ({
                posts: state.posts.map(p =>
                    p.id === postId
                        ? { ...p, stats: { ...p.stats, imports: p.stats.imports + 1 } }
                        : p
                )
            }));
            return post.itinerarySnapshot;
        }
        return null;
    },

    getPost: (postId) => {
        return get().posts.find(p => p.id === postId);
    }
}));
