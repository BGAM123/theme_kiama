import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { 
  UserDTO, 
  CreateUserDTO, 
  UpdateUserDTO, 
  UserFilters,
  PaginatedUsersResponse 
} from '@/types/auth.types';
import { toast } from 'sonner';

// ============================================
// Hook pour lister les utilisateurs (avec pagination et filtres)
// ============================================
export function useAdminUsers(filters: UserFilters = {}) {
  const { page = 0, size = 10, search, role, status } = filters;

  return useQuery({
    queryKey: ['admin-users', { page, size, search, role, status }],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        size,
      };

      if (search) params.search = search;
      if (role) params.role = role;
      if (status) params.status = status;

      const { data } = await apiClient.get<PaginatedUsersResponse>('/admin/users', { 
        params 
      });
      return data;
    },
    staleTime: 30 * 1000, // 30 secondes
    keepPreviousData: true, // Garde les anciennes données pendant le chargement
  });
}

// ============================================
// Hook pour récupérer un utilisateur par ID
// ============================================
export function useUserById(id: string | null) {
  return useQuery({
    queryKey: ['admin-users', id],
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      const { data } = await apiClient.get<UserDTO>(`/admin/users/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ============================================
// Hook pour créer un utilisateur
// ============================================
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserDTO) => {
      // Préparer le payload pour le backend
      const requestPayload = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        role: payload.role,
        ...(payload.password && payload.password.trim() !== '' && { password: payload.password }),
      };

      const { data } = await apiClient.post<UserDTO>('/admin/users', requestPayload);
      return data;
    },
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Utilisateur créé avec succès !', {
        description: `${newUser.firstName} ${newUser.lastName} (${newUser.email})`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Impossible de créer l\'utilisateur.';
      toast.error('Erreur lors de la création', { description: message });
    },
  });
}

// ============================================
// Hook pour mettre à jour un utilisateur
// ============================================
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string } & UpdateUserDTO) => {
      const { data } = await apiClient.patch<UserDTO>(`/admin/users/${id}`, payload);
      return data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users', updatedUser.id] });
      toast.success('Utilisateur mis à jour avec succès !', {
        description: `${updatedUser.firstName} ${updatedUser.lastName}`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Impossible de mettre à jour l\'utilisateur.';
      toast.error('Erreur lors de la mise à jour', { description: message });
    },
  });
}

// ============================================
// Hook pour basculer le statut d'un utilisateur
// ============================================
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { data } = await apiClient.patch<UserDTO>(`/admin/users/${id}/status`, { active });
      return data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users', updatedUser.id] });
      toast.success(`Utilisateur ${updatedUser.status === 'ACTIVE' ? 'activé' : 'désactivé'} avec succès !`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Impossible de modifier le statut.';
      toast.error('Erreur lors du changement de statut', { description: message });
    },
  });
}

// ============================================
// Hook pour supprimer un utilisateur
// ============================================
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/admin/users/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users', deletedId] });
      toast.success('Utilisateur supprimé avec succès !');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 
                     error.response?.data?.error ||
                     'Impossible de supprimer l\'utilisateur.';
      toast.error('Erreur lors de la suppression', { description: message });
    },
  });
}

// ============================================
// Hook pour rafraîchir la liste des utilisateurs
// ============================================
export function useRefreshUsers() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };
}
