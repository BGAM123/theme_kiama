import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { DocumentTypeDTO, StructureNodeDTO } from '@/types/document-type.types';
import { PaginatedResponse } from '@/types/common.types';
import { toast } from 'sonner';

export function useDocumentTypes(filters?: Record<string, string>) {
    return useQuery({
        queryKey: ['document-types', filters],
        queryFn: async () => {
            const { data } = await apiClient.get<PaginatedResponse<DocumentTypeDTO>>('/document-types', { params: filters });
            return data;
        }
    });
}

export function useDocumentType(id: string) {
    return useQuery({
        queryKey: ['document-types', id],
        queryFn: async () => {
            const { data } = await apiClient.get<DocumentTypeDTO>(`/document-types/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useCreateDocumentType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const { data } = await apiClient.post<{ id: string, jobId: string }>('/document-types', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['document-types'] })
    });
}

export function useDeleteDocumentType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => await apiClient.delete(`/document-types/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document-types'] });
            toast.success('Document Type supprimé');
        }
    });
}

export function useValidateDocumentType() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.post<DocumentTypeDTO>(`/document-types/${id}/validate`);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['document-types'] })
    });
}

export function useDocumentTypeStructure(id: string) {
    return useQuery({
        queryKey: ['document-types', id, 'structure'],
        queryFn: async () => {
            const { data } = await apiClient.get<StructureNodeDTO[]>(`/document-types/${id}/structure`);
            return data;
        },
        enabled: !!id,
    });
}

export function useSaveStructure() {
    return useMutation({
        mutationFn: async ({ id, structure }: { id: string, structure: StructureNodeDTO[] }) => {
            const { data } = await apiClient.patch<StructureNodeDTO[]>(`/document-types/${id}/structure`, structure);
            return data;
        }
    });
}
