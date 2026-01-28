// MOCK DATA - TEMPORARY
// Team data for auction
// TODO: Replace with real API calls to backend

export interface PowerCard {
    name: string;
    cost: number;
    available: boolean;
    used: boolean;
}

export interface Team {
    id: number;
    name: string;
    shortName: string;
    logo: string;
    color: string;

    // Budget
    totalBudget: number;
    budgetRemaining: number;
    budgetUsed: number;

    // Squad
    squadCount: number;
    squadLimit: number;

    // Power Cards
    powerCards: {
        finalStrike: PowerCard;
        bidFreezer: PowerCard;
        godsEye: PowerCard;
        mulligan: PowerCard;
        rtm: PowerCard;
    };

    // Players
    players: number[]; // Player ranks
}

export const mockTeams: Team[] = [
    {
        id: 1,
        name: 'Mumbai Mavericks',
        shortName: 'MM',
        logo: '🏏',
        color: '#0066cc',
        totalBudget: 100,
        budgetRemaining: 55,
        budgetUsed: 45,
        squadCount: 3,
        squadLimit: 18,
        powerCards: {
            finalStrike: { name: 'Final Strike', cost: 7, available: true, used: false },
            bidFreezer: { name: 'Bid Freezer', cost: 5, available: true, used: false },
            godsEye: { name: "God's Eye", cost: 4, available: true, used: false },
            mulligan: { name: 'Mulligan', cost: 3, available: true, used: false },
            rtm: { name: 'RTM', cost: 0, available: true, used: false },
        },
        players: [1, 2, 3],
    },
    {
        id: 2,
        name: 'Chennai Champions',
        shortName: 'CC',
        logo: '🦁',
        color: '#ffcc00',
        totalBudget: 100,
        budgetRemaining: 100,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 18,
        powerCards: {
            finalStrike: { name: 'Final Strike', cost: 7, available: true, used: false },
            bidFreezer: { name: 'Bid Freezer', cost: 5, available: true, used: false },
            godsEye: { name: "God's Eye", cost: 4, available: true, used: false },
            mulligan: { name: 'Mulligan', cost: 3, available: true, used: false },
            rtm: { name: 'RTM', cost: 0, available: true, used: false },
        },
        players: [],
    },
    {
        id: 3,
        name: 'Kolkata Knights',
        shortName: 'KK',
        logo: '⚔️',
        color: '#6600cc',
        totalBudget: 100,
        budgetRemaining: 100,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 18,
        powerCards: {
            finalStrike: { name: 'Final Strike', cost: 7, available: true, used: false },
            bidFreezer: { name: 'Bid Freezer', cost: 5, available: true, used: false },
            godsEye: { name: "God's Eye", cost: 4, available: true, used: false },
            mulligan: { name: 'Mulligan', cost: 3, available: true, used: false },
            rtm: { name: 'RTM', cost: 0, available: true, used: false },
        },
        players: [],
    },
    {
        id: 4,
        name: 'Bangalore Bulls',
        shortName: 'BB',
        logo: '🐂',
        color: '#cc0000',
        totalBudget: 100,
        budgetRemaining: 100,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 18,
        powerCards: {
            finalStrike: { name: 'Final Strike', cost: 7, available: true, used: false },
            bidFreezer: { name: 'Bid Freezer', cost: 5, available: true, used: false },
            godsEye: { name: "God's Eye", cost: 4, available: true, used: false },
            mulligan: { name: 'Mulligan', cost: 3, available: true, used: false },
            rtm: { name: 'RTM', cost: 0, available: true, used: false },
        },
        players: [],
    },
    {
        id: 5,
        name: 'Delhi Dragons',
        shortName: 'DD',
        logo: '🐉',
        color: '#0099cc',
        totalBudget: 100,
        budgetRemaining: 100,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 18,
        powerCards: {
            finalStrike: { name: 'Final Strike', cost: 7, available: true, used: false },
            bidFreezer: { name: 'Bid Freezer', cost: 5, available: true, used: false },
            godsEye: { name: "God's Eye", cost: 4, available: true, used: false },
            mulligan: { name: 'Mulligan', cost: 3, available: true, used: false },
            rtm: { name: 'RTM', cost: 0, available: true, used: false },
        },
        players: [],
    },
    {
        id: 6,
        name: 'Punjab Panthers',
        shortName: 'PP',
        logo: '🐆',
        color: '#cc3300',
        totalBudget: 100,
        budgetRemaining: 100,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 18,
        powerCards: {
            finalStrike: { name: 'Final Strike', cost: 7, available: true, used: false },
            bidFreezer: { name: 'Bid Freezer', cost: 5, available: true, used: false },
            godsEye: { name: "God's Eye", cost: 4, available: true, used: false },
            mulligan: { name: 'Mulligan', cost: 3, available: true, used: false },
            rtm: { name: 'RTM', cost: 0, available: true, used: false },
        },
        players: [],
    },
];

export function getMockTeamById(id: number): Team | undefined {
    return mockTeams.find(t => t.id === id);
}

export function getMockTeamByName(name: string): Team | undefined {
    return mockTeams.find(t => t.name === name || t.shortName === name);
}
