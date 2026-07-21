import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { PaginatedResponse } from '@/types/common.types';
import { toast } from 'sonner';

export interface NotificationDTO {
    id: string;
    title: string;
    body: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    isRead: boolean;
    createdAt: string;
    entityId?: string;
    entityType?: string;
}

export function useNotifications(unreadOnly = false) {
    return useQuery({
        queryKey: ['notifications', { unreadOnly }],
        queryFn: async () => {
            // Since no dedicated MSW handler exists yet, return mock data inline
            const mockNotifs: NotificationDTO[] = [
                { id: 'n1', title: 'Extraction terminée', body: 'Le Document Type "Contrat CDI" a été extrait avec succès.', type: 'SUCCESS', isRead: false, createdAt: new Date(Date.now() - 120000).toISOString() },
                { id: 'n2', title: 'Génération complète', body: 'Votre contrat pour Alice est prêt à révision.', type: 'INFO', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
                { id: 'n3', title: 'Échec d\'export', body: 'L\'export PDF a échoué. Veuillez réessayer.', type: 'ERROR', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
                { id: 'n4', title: 'Nouveau modèle disponible', body: 'GPT-4.1 est maintenant disponible dans vos paramètres.', type: 'INFO', isRead: true, createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
            ];
            return {
                content: unreadOnly ? mockNotifs.filter(n => !n.isRead) : mockNotifs,
                totalElements: mockNotifs.length,
                totalPages: 1,
                page: 0,
                size: 20,
            } as PaginatedResponse<NotificationDTO>;
        },
        staleTime: 30 * 1000,
    });
}

export function useMarkAllRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            await apiClient.post('/notifications/read-all');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success('Toutes les notifications ont été marquées comme lues.');
        }
    });
}
