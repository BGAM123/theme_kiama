import { ConversationDTO, MessageDTO } from '../../types/chat.types';

export const mockConversations: ConversationDTO[] = [
    {
        id: 'conv_1',
        title: 'Nouveau CDI Développeur',
        documentTypeId: 'dt_1',
        documentTypeName: 'Contrat de Travail',
        modelId: 'mod_1',
        modelName: 'GPT-4o',
        language: 'Français',
        tone: 'FORMAL',
        targetLength: 'LONG',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Hier
    },
    {
        id: 'conv_2',
        title: 'NDA Prestataire externe',
        documentTypeId: 'dt_2',
        documentTypeName: 'Accord de Confidentialité',
        modelId: 'mod_1',
        modelName: 'GPT-4o',
        language: 'Anglais',
        tone: 'NEUTRAL',
        targetLength: 'SHORT',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(), // Aujourd'hui
    }
];

export const mockMessages: Record<string, MessageDTO[]> = {
    'conv_1': [
        {
            id: 'msg_1',
            conversationId: 'conv_1',
            role: 'USER',
            content: 'Génère un contrat de travail CDI pour le nouveau développeur front-end, prénommé "Alice", avec un salaire de 45K / an, poste basé à Paris.',
            isComplete: true,
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 'msg_2',
            conversationId: 'conv_1',
            role: 'ASSISTANT',
            content: 'Voici le contrat de travail généré.\n\n# CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE\n\n**Entre les soussignés:**\nL\'Entreprise d\'une part,\nEt Mme Alice d\'autre part.\n\n## Article 2 - Rémunération\nLa rémunération annuelle brute est fixée à 45 000 €.',
            isComplete: true,
            conformityScore: 95,
            generatedDocumentId: 'doc_1',
            createdAt: new Date(Date.now() - 86350000).toISOString()
        }
    ],
    'conv_2': [] // Vide
};
