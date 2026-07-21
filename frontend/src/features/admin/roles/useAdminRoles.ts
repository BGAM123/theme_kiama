import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { PermissionDTO, RoleDTO } from '@/types/admin.types';
import { toast } from 'sonner';

const MOCK_ROLES: RoleDTO[] = [
    { id: 'role_admin', name: 'ADMIN', label: 'Administrateur' },
    { id: 'role_user', name: 'USER', label: 'Utilisateur' },
];

const MOCK_PERMISSIONS: PermissionDTO[] = [
    { feature: 'Génération de documents', description: 'Créer des documents via le Chat IA', roleIds: ['role_admin', 'role_user'] },
    { feature: 'Importer un Document Type', description: 'Uploader et analyser des modèles Word/PDF', roleIds: ['role_admin', 'role_user'] },
    { feature: 'Éditer la structure', description: 'Modifier l\'arborescence sémantique', roleIds: ['role_admin'] },
    { feature: 'Gérer les utilisateurs', description: 'Créer, modifier ou supprimer des comptes', roleIds: ['role_admin'] },
    { feature: 'Gérer les modèles IA', description: 'Activer, désactiver et configurer les LLMs', roleIds: ['role_admin'] },
    { feature: 'Voir le journal d\'activité', description: 'Accéder au log des actions de la plateforme', roleIds: ['role_admin'] },
    { feature: 'Exporter des documents', description: 'Télécharger en PDF, DOCX ou Markdown', roleIds: ['role_admin', 'role_user'] },
];

export function useAdminRoles() {
    return useQuery({
        queryKey: ['admin-roles'],
        queryFn: async () => ({ roles: MOCK_ROLES, permissions: MOCK_PERMISSIONS }),
    });
}

export function useSavePermissions() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (permissions: PermissionDTO[]) => {
            await apiClient.patch('/admin/permissions', permissions);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
            toast.success('Permissions enregistrées.');
        },
    });
}
