import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { MessageDTO } from '@/types/chat.types';

export function useMessages(conversationId: string | undefined) {
    return useQuery({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            if (!conversationId) return [];
            const { data } = await apiClient.get<MessageDTO[]>(`/conversations/${conversationId}/messages`);
            return data;
        },
        enabled: !!conversationId,
    });
}
