import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ExtractionStatusDTO } from '@/types/document-type.types';

export function useExtractionStatus(jobId: string | null) {
    return useQuery({
        queryKey: ['extraction-jobs', jobId],
        queryFn: async () => {
            const { data } = await apiClient.get<ExtractionStatusDTO>(`/extraction-jobs/${jobId}`);
            return data;
        },
        enabled: !!jobId,
        // Polling technique: refetch every 2000ms until condition is met
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            if (status === 'COMPLETED' || status === 'FAILED') return false; // Stop polling
            return 2000;
        }
    });
}
