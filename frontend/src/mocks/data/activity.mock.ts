import { ActivityEventDTO } from '../../types/admin.types';

export const mockActivityLogs: ActivityEventDTO[] = [
    {
        id: 'act_1',
        userId: 'usr_2',
        userName: 'Sophie Martin',
        action: 'Génération',
        entityType: 'Document',
        entityLabel: 'Contrat Dev Front',
        detail: 'Modèle: GPT-4o, Document Type: dt_1',
        ipAddress: '192.168.1.55',
        createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: 'act_2',
        userId: 'usr_1',
        userName: 'Jean Dupont',
        action: 'Import',
        entityType: 'Document Type',
        entityLabel: 'Charte IT',
        detail: 'Import PDF',
        ipAddress: '10.0.0.12',
        createdAt: new Date(Date.now() - 86400000).toISOString()
    }
];
