import { http, HttpResponse, delay } from 'msw';
import { mockUsers } from '../data/users.mock';
import { mockActivityLogs } from '../data/activity.mock';
import { AiModelDTO } from '../../types/admin.types';

const API_URL = import.meta.env?.VITE_API_URL || '/api';

export const adminHandlers = [
    http.get(`${API_URL}/admin/users`, async () => {
        await delay(400);
        return HttpResponse.json({
            content: mockUsers,
            totalElements: mockUsers.length,
            totalPages: 1,
            page: 0,
            size: 20
        });
    }),

    http.get(`${API_URL}/admin/activity`, async () => {
        await delay(300);
        return HttpResponse.json({
            content: mockActivityLogs,
            totalElements: mockActivityLogs.length,
            totalPages: 1,
            page: 0,
            size: 20
        });
    }),

    http.get(`${API_URL}/admin/ai-models`, async () => {
        await delay(200);
        const models: AiModelDTO[] = [
            { id: 'mod_1', provider: 'OpenAI', modelName: 'GPT-4o', status: 'ACTIVE', isDefault: true, requestCount: 15420, avgResponseTime: 2.1, costPer1kTokens: 0.005 },
            { id: 'mod_2', provider: 'Anthropic', modelName: 'Claude 3.5 Sonnet', status: 'ACTIVE', isDefault: false, requestCount: 8400, avgResponseTime: 1.8, costPer1kTokens: 0.003 },
        ];
        return HttpResponse.json(models);
    }),

    http.get(`${API_URL}/dashboard/stats`, async () => {
        await delay(500);
        return HttpResponse.json({
            totalDocuments: 1452,
            avgGenerationTime: 4.2,
            activeDocTypes: 12,
            activeUsers: 8,
            dailyStats: [], // simplifier initialement
            categoryBreakdown: []
        });
    })
];
