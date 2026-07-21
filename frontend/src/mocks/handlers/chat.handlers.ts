import { http, HttpResponse, delay } from 'msw';
import { mockConversations, mockMessages } from '../data/conversations.mock';
import { ConversationDTO } from '../../types/chat.types';

const API_URL = import.meta.env?.VITE_API_URL || '/api';

export const chatHandlers = [
    http.get(`${API_URL}/conversations`, async () => {
        await delay(400);
        return HttpResponse.json({
            content: mockConversations,
            totalElements: mockConversations.length,
            totalPages: 1,
            page: 0,
            size: 20
        });
    }),

    http.post(`${API_URL}/conversations`, async () => {
        await delay(600);
        const newConv: ConversationDTO = {
            id: `conv_${Date.now()}`,
            title: 'Nouvelle conversation',
            documentTypeId: 'dt_1',
            documentTypeName: 'DocType par défaut',
            modelId: 'mod_1',
            modelName: 'GPT-4o',
            language: 'Français',
            tone: 'FORMAL',
            targetLength: 'SHORT',
            status: 'ACTIVE',
            createdAt: new Date().toISOString()
        };
        return HttpResponse.json(newConv);
    }),

    http.get(`${API_URL}/conversations/:id/messages`, async ({ params }) => {
        await delay(300);
        return HttpResponse.json(mockMessages[params.id as string] || []);
    }),

    // SSE STREAMING SIMULATION
    http.post(`${API_URL}/conversations/:id/messages`, async () => {
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                const paragraph = "Ceci est un document généré par DocuAI en mode streaming. Nous vérifions la réactivité de l'interface en direct avec React 19 et MSW. L'analyse du document de référence a permis de calibrer cette génération pour correspondre parfaitement au cahier des charges.\n\n### Conclusion\nLe streaming fonctionne !";
                const words = paragraph.split(' ');

                for (const word of words) {
                    const chunk = JSON.stringify({ type: 'chunk', data: word + ' ' });
                    controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
                    await new Promise(r => setTimeout(r, 60)); // Simulate chunk delay
                }

                const done = JSON.stringify({ type: 'done', documentId: `doc_${Date.now()}` });
                controller.enqueue(encoder.encode(`data: ${done}\n\n`));
                controller.close();
            }
        });

        return new HttpResponse(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            }
        });
    })
];
