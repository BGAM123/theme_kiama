export interface ConversationDTO {
    id: string;
    title: string;
    documentTypeId: string;
    documentTypeName: string;
    modelId: string;
    modelName: string;
    language: string;
    tone: string;
    targetLength: string;
    status: 'ACTIVE' | 'ARCHIVED';
    createdAt: string;
}

export interface MessageDTO {
    id: string;
    conversationId: string;
    role: 'USER' | 'ASSISTANT';
    content: string;
    isComplete: boolean;
    conformityScore?: number;
    generatedDocumentId?: string;
    createdAt: string;
}

export interface GenerationParamsDTO {
    documentTypeId: string;
    language: string;
    tone: 'FORMAL' | 'NEUTRAL' | 'DIRECT';
    targetLength: 'SHORT' | 'MEDIUM' | 'LONG';
    modelId: string;
    referenceDocumentIds: string[];
    prompt: string;
}
