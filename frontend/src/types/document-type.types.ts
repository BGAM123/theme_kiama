export type DocTypeStatus = 'IMPORTED' | 'EXTRACTING' | 'EXTRACTED' | 'ACTIVE' | 'ARCHIVED';

export interface DocumentTypeDTO {
    id: string;
    name: string;
    categoryId: string;
    categoryName: string;
    status: DocTypeStatus;
    sectionsCount: number;
    documentsCount: number;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface StructureNodeDTO {
    id: string;
    type: 'COVER' | 'TOC' | 'H1' | 'H2' | 'H3' | 'TABLE' | 'LIST' | 'SIGNATURE' | 'FIELD';
    label: string;
    order: number;
    required: boolean;
    children: StructureNodeDTO[];
}

export interface ExtractionStatusDTO {
    jobId: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    progress: number;
    currentStep: string;
    errorMessage?: string;
}
