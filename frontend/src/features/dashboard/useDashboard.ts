import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface DashboardStatsDTO {
    totalDocuments: number;
    avgGenerationTime: number;
    activeDocTypes: number;
    activeUsers: number;
    dailyStats: { date: string; count: number; avgTime: number }[];
    categoryBreakdown: { category: string; count: number }[];
}

export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const { data } = await apiClient.get<DashboardStatsDTO>('/dashboard/stats');
            return data;
        },
        staleTime: 30 * 1000, // 30 seconds as requested
    });
}
