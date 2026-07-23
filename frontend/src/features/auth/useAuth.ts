import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LoginDTO, TokenDTO, UserDTO } from '@/types/auth.types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function useLogin() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (credentials: LoginDTO) => {
            const { data } = await apiClient.post<TokenDTO>('/auth/login', credentials);
            return data;
        },
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            // Le refresh token est stocké automatiquement dans un cookie HTTP-only par le backend
            toast.success('Connexion réussie');
            navigate('/dashboard', { replace: true });
        },
        onError: (error: any) => {
            toast.error(error.response?.status === 401 ? 'Identifiants invalides.' : 'Service temporairement indisponible.');
        }
    });
}

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await apiClient.post('/auth/logout').catch(() => { });
        },
        onSettled: () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            queryClient.clear();
            navigate('/login', { replace: true });
            toast.info('Vous êtes déconnecté.');
        }
    });
}

export function useCurrentUser() {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error('Not authenticated');
            // Simulated response for current user since backend not fully defined
            return { id: 'usr_1', firstName: 'Admin', lastName: 'System', email: 'admin@docu.ai', role: 'ADMIN', status: 'ACTIVE' } as UserDTO;
        },
        staleTime: Infinity,
    });
}
