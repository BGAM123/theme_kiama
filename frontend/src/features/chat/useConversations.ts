import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ConversationDTO } from '@/types/chat.types';
import { PaginatedResponse } from '@/types/common.types';
import { useNavigate } from 'react-router-dom';

export function useConversations() {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const { data } = await apiClient.get<PaginatedResponse<ConversationDTO>>('/conversations');
            return data;
        }
    });
}

export function useConversation(id: string) {
    return useQuery({
        queryKey: ['conversations', id],
        queryFn: async () => {
            const { data } = await apiClient.get<ConversationDTO>(`/conversations/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useCreateConversation() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            const { data } = await apiClient.post<ConversationDTO>('/conversations');
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            navigate(`/chat/${data.id}`);
        }
    });
}

export function useDeleteConversation() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/conversations/${id}`);
        },
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            // Remove from view if currently loaded
            if (window.location.pathname === `/chat/${deletedId}`) {
                navigate('/chat');
            }
        }
    });
}
