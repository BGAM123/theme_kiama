import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ActivityEventDTO } from '@/types/admin.types';
import { PaginatedResponse } from '@/types/common.types';

interface ActivityFilters {
    page?: number;
    size?: number;
    userId?: string;
    action?: string;
    from?: string;
    to?: string;
}

export function useActivityLog(filters?: ActivityFilters) {
    return useQuery({
        queryKey: ['admin-activity', filters],
        queryFn: async () => {
            const { data } = await apiClient.get<PaginatedResponse<ActivityEventDTO>>('/admin/activity', {
                params: { page: 0, size: 20, ...filters },
            });
            return data;
        },
        staleTime: 60 * 1000,
    });
}
