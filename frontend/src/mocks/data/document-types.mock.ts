import { DocumentTypeDTO, StructureNodeDTO } from '../../types/document-type.types';

export const mockDocumentTypes: DocumentTypeDTO[] = [
    {
        id: 'dt_1',
        name: 'Contrat de Travail à Durée Indéterminée',
        categoryId: 'cat_rh',
        categoryName: 'Ressources Humaines',
        status: 'ACTIVE',
        sectionsCount: 8,
        documentsCount: 145,
        description: 'Modèle standard CDI pour les nouveaux employés.',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-06-05T11:20:00Z',
    },
    {
        id: 'dt_2',
        name: 'Accord de Confidentialité (NDA)',
        categoryId: 'cat_jur',
        categoryName: 'Juridique',
        status: 'ACTIVE',
        sectionsCount: 4,
        documentsCount: 312,
        description: 'NDA bilatéral standard.',
        createdAt: '2023-11-20T14:30:00Z',
        updatedAt: '2024-02-15T10:00:00Z',
    },
    {
        id: 'dt_3',
        name: 'Bilan Financier Trimestriel',
        categoryId: 'cat_fin',
        categoryName: 'Finance',
        status: 'EXTRACTED',
        sectionsCount: 12,
        documentsCount: 0,
        description: 'Structure validée, en attente de validation finale.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export const mockStructure: StructureNodeDTO[] = [
    { id: 'node_1', type: 'COVER', label: 'Page de garde', order: 1, required: true, children: [] },
    { id: 'node_2', type: 'H1', label: 'Article 1 - Objet', order: 2, required: true, children: [] },
    {
        id: 'node_3', type: 'H1', label: 'Article 2 - Rémunération', order: 3, required: true, children: [
            { id: 'node_3_1', type: 'H2', label: 'Salaire de base', order: 1, required: true, children: [] },
            { id: 'node_3_2', type: 'H2', label: 'Primes et bonus', order: 2, required: false, children: [] }
        ]
    },
    { id: 'node_4', type: 'SIGNATURE', label: 'Signatures des parties', order: 4, required: true, children: [] }
];
