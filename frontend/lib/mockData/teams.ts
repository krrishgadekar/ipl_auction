// MOCK DATA - TEMPORARY
// Team data for auction - 10 real IPL 2026 teams
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
    primaryColor: string;

    // Budget (120 CR per rulebook)
    totalBudget: number;
    budgetRemaining: number;
    budgetUsed: number;

    // Squad (15 players per rulebook)
    squadCount: number;
    squadLimit: number;

    // Power Cards (4 cards, 1 CR each, per rulebook §7)
    powerCards: {
        finalStrike: PowerCard;
        bidFreezer: PowerCard;
        godsEye: PowerCard;
        mulligan: PowerCard;
    };

    // Players (by rank)
    players: number[];

    // Overseas count
    overseasCount: number;

    // IPL Franchise name (bought pre-auction)
    franchiseName?: string;
}

const defaultPowerCards = () => ({
    finalStrike: { name: 'Final Strike', cost: 1, available: true, used: false },
    bidFreezer: { name: 'Bid Freezer', cost: 1, available: true, used: false },
    godsEye: { name: "God's Eye", cost: 1, available: true, used: false },
    mulligan: { name: 'Mulligan', cost: 1, available: true, used: false },
});

export const mockTeams: Team[] = [
    {
        id: 1,
        name: 'Mumbai Indians',
        shortName: 'MI',
        logo: '/teams/mi.png',
        color: 'from-blue-700 to-blue-900',
        primaryColor: '#004BA0',
        totalBudget: 120,
        budgetRemaining: 120,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 15,
        powerCards: defaultPowerCards(),
        players: [],
        overseasCount: 0,
    },
    {
        id: 2,
        name: 'Chennai Super Kings',
        shortName: 'CSK',
        logo: '/teams/csk.png',
        color: 'from-yellow-400 to-yellow-600',
        primaryColor: '#FCBD02',
        totalBudget: 120,
        budgetRemaining: 120,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 15,
        powerCards: defaultPowerCards(),
        players: [],
        overseasCount: 0,
    },
    {
        id: 3,
        name: 'Royal Challengers Bengaluru',
        shortName: 'RCB',
        logo: '/teams/rcb.png',
        color: 'from-red-600 to-red-900',
        primaryColor: '#EC1C24',
        totalBudget: 120,
        budgetRemaining: 76,
        budgetUsed: 44,
        squadCount: 3,
        squadLimit: 15,
        powerCards: defaultPowerCards(),
        players: [1, 6, 19],
        overseasCount: 1,
    },
    {
        id: 4,
        name: 'Kolkata Knight Riders',
        shortName: 'KKR',
        logo: '/teams/kkr.png',
        color: 'from-purple-700 to-purple-900',
        primaryColor: '#3A225D',
        totalBudget: 120,
        budgetRemaining: 120,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 15,
        powerCards: defaultPowerCards(),
        players: [],
        overseasCount: 0,
    },
    {
        id: 5,
        name: 'Delhi Capitals',
        shortName: 'DC',
        logo: '/teams/dc.png',
        color: 'from-sky-500 to-sky-700',
        primaryColor: '#0078BC',
        totalBudget: 120,
        budgetRemaining: 120,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 15,
        powerCards: defaultPowerCards(),
        players: [],
        overseasCount: 0,
    },
    {
        id: 6,
        name: 'Punjab Kings',
        shortName: 'PBKS',
        logo: '/teams/pbks.png',
        color: 'from-red-500 to-red-700',
        primaryColor: '#ED1B24',
        totalBudget: 120,
        budgetRemaining: 120,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 15,
        powerCards: defaultPowerCards(),
        players: [],
        overseasCount: 0,
    },
    {
        id: 7,
        name: 'Rajasthan Royals',
        shortName: 'RR',
        logo: '/teams/rr.png',
        color: 'from-pink-500 to-pink-700',
        primaryColor: '#254AA5',
        totalBudget: 120,
        budgetRemaining: 120,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 15,
        powerCards: defaultPowerCards(),
        players: [],
        overseasCount: 0,
    },
    {
        id: 8,
        name: 'Gujarat Titans',
        shortName: 'GT',
        logo: '/teams/gt.png',
        color: 'from-teal-500 to-teal-700',
        primaryColor: '#1D5E84',
        totalBudget: 120,
        budgetRemaining: 120,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 15,
        powerCards: defaultPowerCards(),
        players: [],
        overseasCount: 0,
    },
    {
        id: 9,
        name: 'Sunrisers Hyderabad',
        shortName: 'SRH',
        logo: '/teams/srh.png',
        color: 'from-orange-500 to-orange-700',
        primaryColor: '#F7A721',
        totalBudget: 120,
        budgetRemaining: 120,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 15,
        powerCards: defaultPowerCards(),
        players: [],
        overseasCount: 0,
    },
    {
        id: 10,
        name: 'Lucknow Super Giants',
        shortName: 'LSG',
        logo: '/teams/lsg.png',
        color: 'from-teal-600 to-cyan-800',
        primaryColor: '#A72056',
        totalBudget: 120,
        budgetRemaining: 120,
        budgetUsed: 0,
        squadCount: 0,
        squadLimit: 15,
        powerCards: defaultPowerCards(),
        players: [],
        overseasCount: 0,
    },
];

export function getMockTeamById(id: number): Team | undefined {
    return mockTeams.find(t => t.id === id);
}

export function getMockTeamByName(name: string): Team | undefined {
    return mockTeams.find(t => t.name === name || t.shortName === name);
}
