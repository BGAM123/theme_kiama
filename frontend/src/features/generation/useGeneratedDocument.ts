import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { GeneratedDocumentDTO } from '@/types/document.types';

export function useGeneratedDocument(id: string | undefined) {
    return useQuery({
        queryKey: ['documents', id],
        queryFn: async () => {
            if (!id) throw new Error("No id");
            const { data } = await apiClient.get<GeneratedDocumentDTO>(`/documents/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useSaveDocument() {
    return useMutation({
        mutationFn: async ({ id, content }: { id: string, content: string }) => {
            const { data } = await apiClient.patch<GeneratedDocumentDTO>(`/documents/${id}`, { content });
            return data;
        }
    });
}

export function useExportDocument() {
    return useMutation({
        mutationFn: async ({ id, format }: { id: string, format: 'DOCX' | 'PDF' | 'MARKDOWN' }) => {
            const response = await apiClient.post(`/documents/${id}/export`, { format }, { responseType: 'blob' });

            const blob = new Blob([response.data], {
                type: format === 'PDF'
                    ? 'application/pdf'
                    : format === 'DOCX'
                        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        : 'text/markdown'
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document_${id}.${format.toLowerCase()}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    });
}
