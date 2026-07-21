import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ConversationDTO } from '@/types/chat.types';
import { PaginatedResponse } from '@/types/common.types';

interface HistoryFilters {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    from?: string;
    to?: string;
}

export function useHistory(filters?: HistoryFilters) {
    return useQuery({
        queryKey: ['history', filters],
        queryFn: async () => {
            const { data } = await apiClient.get<PaginatedResponse<ConversationDTO>>('/history', {
                params: { page: 0, size: 20, ...filters }
            });
            return data;
        },
        staleTime: 60 * 1000,
    });
}
