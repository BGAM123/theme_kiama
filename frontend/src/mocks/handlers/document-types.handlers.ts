import { http, HttpResponse, delay } from 'msw';
import { mockDocumentTypes, mockStructure } from '../data/document-types.mock';

const API_URL = import.meta.env?.VITE_API_URL || '/api';

let extractionProgress = 0;

export const documentTypesHandlers = [
    // Listers
    http.get(`${API_URL}/document-types`, async () => {
        await delay(500);
        return HttpResponse.json({
            content: mockDocumentTypes,
            totalElements: mockDocumentTypes.length,
            totalPages: 1,
            page: 0,
            size: 20
        });
    }),

    http.get(`${API_URL}/document-types/:id`, async ({ params }) => {
        await delay(300);
        const docType = mockDocumentTypes.find(d => d.id === params.id);
        if (!docType) return new HttpResponse(null, { status: 404 });
        return HttpResponse.json(docType);
    }),

    // CREATE via multipart
    http.post(`${API_URL}/document-types`, async () => {
        await delay(1200);
        // On simule une création réussie
        extractionProgress = 0; // Reset pending state
        return HttpResponse.json({
            id: 'dt_new',
            jobId: 'job_12345',
            name: 'Nouveau Document',
            categoryId: 'cat_1',
            categoryName: 'General',
            status: 'EXTRACTING',
            sectionsCount: 0,
            documentsCount: 0,
            description: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
    }),

    // POLLING STRUCTURE EXTRACTION
    http.get(`${API_URL}/extraction-jobs/:jobId`, async () => {
        await delay(100);
        if (extractionProgress < 100) {
            extractionProgress += 25;
            return HttpResponse.json({
                jobId: 'job_12345',
                status: extractionProgress === 0 ? 'PENDING' : 'RUNNING',
                progress: extractionProgress,
                currentStep: extractionProgress < 50 ? 'Lecture OCR' : 'Analyse Layout'
            });
        }

        return HttpResponse.json({
            jobId: 'job_12345',
            status: 'COMPLETED',
            progress: 100,
            currentStep: 'Extraction Analytique'
        });
    }),

    http.get(`${API_URL}/document-types/:id/structure`, async () => {
        await delay(400);
        return HttpResponse.json(mockStructure);
    }),

    http.patch(`${API_URL}/document-types/:id/structure`, async () => {
        await delay(500);
        return HttpResponse.json(mockStructure);
    }),

    http.post(`${API_URL}/document-types/:id/validate`, async ({ params }) => {
        await delay(500);
        return HttpResponse.json({ ...mockDocumentTypes[0], status: 'ACTIVE' });
    }),

    http.delete(`${API_URL}/document-types/:id`, async () => {
        await delay(500);
        return new HttpResponse(null, { status: 204 });
    })
];
