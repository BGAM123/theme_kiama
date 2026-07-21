import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { UserDTO } from '@/types/auth.types';
import { PaginatedResponse } from '@/types/common.types';
import { toast } from 'sonner';

export function useAdminUsers(filters?: Record<string, string>) {
    return useQuery({
        queryKey: ['admin-users', filters],
        queryFn: async () => {
            const { data } = await apiClient.get<PaginatedResponse<UserDTO>>('/admin/users', { params: filters });
            return data;
        },
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Omit<UserDTO, 'id' | 'status' | 'lastLoginAt' | 'createdAt'>) => {
            const { data } = await apiClient.post<UserDTO>('/admin/users', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success('Utilisateur créé avec succès.');
        },
        onError: () => toast.error("Impossible de créer l'utilisateur."),
    });
}

export function useToggleUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
            const { data } = await apiClient.patch<UserDTO>(`/admin/users/${id}/status`, { active });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/admin/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            toast.success('Utilisateur supprimé.');
        },
    });
}
