import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'agent';
export type PlotStatus = 'in-sale' | 'booked' | 'sold' | 'reserved' | 'blocked';

export interface User {
    id: string;
    username: string;
    role: UserRole;
}

export interface Plot {
    id: string;
    plotNumber: string;
    status: PlotStatus;
    x: number;
    y: number;
}

export interface Venture {
    id: string;
    name: string;
    description: string;
    plots: Plot[];
    totalPlots: number;
    isBlocked?: boolean; // Track if entire venture is blocked
}

interface AuthContextType {
    user: User | null;
    ventures: Venture[];
    login: (username: string, password: string) => boolean;
    logout: () => void;
    updatePlotStatus: (ventureId: string, plotId: string, status: PlotStatus) => void;
    blockAllPlotsInVenture: (ventureId: string) => void; // New function
    unblockAllPlotsInVenture: (ventureId: string) => void; // New function
    addVenture: (venture: Omit<Venture, 'id'>) => void;
    deleteVenture: (ventureId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const mockUsers: Record<string, User> = {
    'admin': { id: '1', username: 'admin', role: 'admin' },
    'agent': { id: '2', username: 'agent', role: 'agent' },
};

const generatePlots = (count: number): Plot[] => {
    const plots: Plot[] = [];
    const gridSize = Math.ceil(Math.sqrt(count));

    for (let i = 0; i < count; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        plots.push({
            id: `plot-${i + 1}`,
            plotNumber: `P${(i + 1).toString().padStart(3, '0')}`,
            status: 'in-sale',
            x: col,
            y: row,
        });
    }

    return plots;
};

const initialVentures: Venture[] = [
    {
        id: '1',
        name: 'Sunrise Valley',
        description: 'Premium residential plots with modern amenities',
        plots: generatePlots(120),
        totalPlots: 120,
        isBlocked: false,
    },
    {
        id: '2',
        name: 'Golden Heights',
        description: 'Luxury plots with scenic mountain views',
        plots: generatePlots(80),
        totalPlots: 80,
        isBlocked: false,
    },
    {
        id: '3',
        name: 'Green Meadows',
        description: 'Eco-friendly residential community',
        plots: generatePlots(200),
        totalPlots: 200,
        isBlocked: false,
    },
];

// Set some initial plot statuses
initialVentures[0].plots[5].status = 'booked';
initialVentures[0].plots[12].status = 'sold';
initialVentures[0].plots[18].status = 'reserved';
initialVentures[0].plots[25].status = 'booked';
initialVentures[1].plots[8].status = 'sold';
initialVentures[1].plots[15].status = 'reserved';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [ventures, setVentures] = useState<Venture[]>(initialVentures);

    const login = (username: string, password: string): boolean => {
        if (password === 'password' && mockUsers[username]) {
            setUser(mockUsers[username]);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const updatePlotStatus = (ventureId: string, plotId: string, status: PlotStatus) => {
        // Only allow admin to perform certain actions
        if (user?.role !== 'admin' && status === 'blocked') {
            console.warn('Only admin can block plots');
            return;
        }

        setVentures(prev => prev.map(venture =>
            venture.id === ventureId
                ? {
                    ...venture,
                    plots: venture.plots.map(plot =>
                        plot.id === plotId ? { ...plot, status } : plot
                    )
                }
                : venture
        ));
    };

    const blockAllPlotsInVenture = (ventureId: string) => {
        // Only admin can block all plots
        if (user?.role !== 'admin') {
            console.warn('Only admin can block all plots in a venture');
            return;
        }

        setVentures(prev => prev.map(venture =>
            venture.id === ventureId
                ? {
                    ...venture,
                    isBlocked: true,
                    plots: venture.plots.map(plot => ({
                        ...plot,
                        status: 'blocked' as PlotStatus
                    }))
                }
                : venture
        ));
    };

    const unblockAllPlotsInVenture = (ventureId: string) => {
        // Only admin can unblock all plots
        if (user?.role !== 'admin') {
            console.warn('Only admin can unblock all plots in a venture');
            return;
        }

        setVentures(prev => prev.map(venture =>
            venture.id === ventureId
                ? {
                    ...venture,
                    isBlocked: false,
                    plots: venture.plots.map(plot => ({
                        ...plot,
                        status: plot.status === 'blocked' ? 'in-sale' : plot.status
                    }))
                }
                : venture
        ));
    };

    const addVenture = (ventureData: Omit<Venture, 'id'>) => {
        const newVenture: Venture = {
            ...ventureData,
            id: Date.now().toString(),
            isBlocked: false,
        };
        setVentures(prev => [...prev, newVenture]);
    };

    const deleteVenture = (ventureId: string) => {
        setVentures(prev => prev.filter(venture => venture.id !== ventureId));
    };

    return (
        <AuthContext.Provider value={{
            user,
            ventures,
            login,
            logout,
            updatePlotStatus,
            blockAllPlotsInVenture,
            unblockAllPlotsInVenture,
            addVenture,
            deleteVenture,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
