import { QueryClient } from '@tanstack/react-query';

// Configure the React Query client aligned with B2B app requirements
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000, // 60 seconds of freshness
            refetchOnWindowFocus: false, // Prevents unintended repetitive queries on workspace switches
            retry: 1, // Only retry once per query if it fails
        },
    },
});
