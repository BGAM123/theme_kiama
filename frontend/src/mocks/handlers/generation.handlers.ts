import { http, HttpResponse, delay } from 'msw';
import { GeneratedDocumentDTO } from '../../types/document.types';

const API_URL = import.meta.env?.VITE_API_URL || '/api';

export const generationHandlers = [
    http.get(`${API_URL}/documents/:id`, async ({ params }) => {
        await delay(300);
        const fakeDoc: GeneratedDocumentDTO = {
            id: params.id as string,
            conversationId: 'conv_1',
            title: 'Contrat Généré',
            content: '<h1>Contrat de Travail</h1><p>Ceci est un contenu éditable via TipTap.</p>',
            conformityScore: 92,
            conformityDetails: [
                { sectionLabel: 'Objet du contrat', present: true },
                { sectionLabel: 'Rémunération', present: true },
                { sectionLabel: 'Période d\'essai', present: false, message: 'La section est manquante ou incomplète.' },
            ],
            status: 'DRAFT',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return HttpResponse.json(fakeDoc);
    }),

    http.patch(`${API_URL}/documents/:id`, async ({ request, params }) => {
        await delay(300); // 1.5s debounce in hooks anyway
        const body: any = await request.json();
        return HttpResponse.json({
            id: params.id,
            content: body.content,
            status: 'DRAFT'
        });
    }),

    http.post(`${API_URL}/documents/:id/export`, async () => {
        await delay(1000);
        // Simulating file download by providing a text blob
        const fileContent = "Fichier exporté fictivement par MSW.";
        return new HttpResponse(new Blob([fileContent], { type: 'application/octet-stream' }), {
            headers: {
                'Content-Disposition': 'attachment; filename="export.docx"',
                'Content-Type': 'application/octet-stream'
            }
        });
    })
];
