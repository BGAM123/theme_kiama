export interface RoleDTO {
    id: string;
    name: string;
    label: string;
}

export interface PermissionDTO {
    feature: string;
    description: string;
    roleIds: string[];
}

export interface AiModelDTO {
    id: string;
    provider: string;
    modelName: string;
    status: 'ACTIVE' | 'INACTIVE';
    isDefault: boolean;
    requestCount: number;
    avgResponseTime: number;
    costPer1kTokens: number;
}

export interface ActivityEventDTO {
    id: string;
    userId: string;
    userName: string;
    action: string;
    entityType: string;
    entityLabel: string;
    detail: string;
    ipAddress: string;
    createdAt: string;
}
