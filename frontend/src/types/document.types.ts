export interface ConformityItemDTO {
    sectionLabel: string;
    present: boolean;
    message?: string;
}

export interface GeneratedDocumentDTO {
    id: string;
    conversationId: string;
    title: string;
    content: string;
    conformityScore: number;
    conformityDetails: ConformityItemDTO[];
    status: 'DRAFT' | 'EXPORTED';
    createdAt: string;
    updatedAt: string;
}
