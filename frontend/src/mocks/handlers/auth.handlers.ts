import { http, HttpResponse, delay } from 'msw';
import { mockUsers } from '../data/users.mock';

const API_URL = import.meta.env?.VITE_API_URL || '/api';

export const authHandlers = [
    http.post(`${API_URL}/auth/login`, async ({ request }) => {
        await delay(600);
        const body = (await request.json()) as any;

        // Accept valid-looking credentials to facilitate local dev testing without locking us out
        if (body.email && body.password.length >= 8) {
            return HttpResponse.json({
                accessToken: 'fake_jwt_access_token_123',
                refreshToken: 'fake_jwt_refresh_token_456',
                expiresIn: 3600
            });
        }

        return new HttpResponse('Identifiants invalides.', { status: 401 });
    }),

    http.post(`${API_URL}/auth/refresh`, async () => {
        await delay(300);
        return HttpResponse.json({
            accessToken: 'refreshed_fake_jwt_access_token_123',
            refreshToken: 'new_fake_jwt_refresh_token_456',
            expiresIn: 3600
        });
    }),

    http.post(`${API_URL}/auth/logout`, async () => {
        await delay(300);
        return new HttpResponse(null, { status: 204 });
    }),
];
