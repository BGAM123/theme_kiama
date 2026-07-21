import { useState, useRef } from 'react';
import { GenerationParamsDTO } from '@/types/chat.types';

export function useStreamGeneration() {
    const [isGenerating, setIsGenerating] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const generate = async (
        conversationId: string,
        params: GenerationParamsDTO,
        onChunk: (text: string) => void,
        onDone: (documentId: string) => void,
        onError?: (err: Error) => void
    ) => {
        setIsGenerating(true);
        abortControllerRef.current = new AbortController();

        try {
            const token = localStorage.getItem('accessToken');
            const baseUrl = import.meta.env?.VITE_API_URL || '/api';

            const response = await fetch(`${baseUrl}/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(params),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No readable stream available");

            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                // Handle SSE multi-line formats by splitting at newlines
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const rawData = line.replace('data: ', '').trim();
                        if (!rawData) continue;

                        try {
                            const data = JSON.parse(rawData);
                            if (data.type === 'chunk' && data.data) {
                                onChunk(data.data);
                            } else if (data.type === 'done' && data.documentId) {
                                onDone(data.documentId);
                            }
                        } catch (e) {
                            console.warn("Could not parse stream line:", line);
                        }
                    }
                }
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log("Stream aborted manually");
            } else {
                onError?.(err);
            }
        } finally {
            setIsGenerating(false);
            abortControllerRef.current = null;
        }
    };

    const abort = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    return { generate, isGenerating, abort };
}
