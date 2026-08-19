export interface GenerateProductDetailsRequest {
    imageUrl: string;
    generateSku?: boolean;
    type?: string;
    material?: string;
    color?: string;
    room?: string;
    dimensions?: string;
}

export interface GenerateProductDetailsResponse {
    success: boolean;
    title: string;
    description: string;
    type?: string;
    material?: string;
    color?: string;
    dimensions?: string;
    sku?: string;
    error?: string;
}
