export interface ItemGroup {
    id: string;
    code: string;
    nameAr: string;
    nameEn: string;
    level: number;
    isActive: boolean;
    createAt: string;
}

export interface Pagination {
     pageIndex: number;
        pageSize?: number;
        searchingWord?: string;
        level?: number;
        orderBy?: string;
        orderDirection?: 'asc' | 'desc';
}

export interface ItemGroupResponse {
    data: {
        items: ItemGroup[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
    succeeded: boolean;
    message: string | null;
    statusCode: number;
    errorCode: string | null;
    errors: any;
}

export interface AddItemGroup {
    code: string;
    nameAr: string;
    nameEn: string;
    level: number;
    isActive?: boolean;
}
