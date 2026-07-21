import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AiModelDTO } from '@/types/admin.types';
import { toast } from 'sonner';

export function useAdminModels() {
    return useQuery({
        queryKey: ['admin-models'],
        queryFn: async () => {
            const { data } = await apiClient.get<AiModelDTO[]>('/admin/ai-models');
            return data;
        },
    });
}

export function useUpdateAiModel() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...payload }: Partial<AiModelDTO> & { id: string }) => {
            const { data } = await apiClient.patch<AiModelDTO>(`/admin/ai-models/${id}`, payload);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-models'] }),
        onError: () => toast.error('Impossible de mettre à jour le modèle.'),
    });
}
