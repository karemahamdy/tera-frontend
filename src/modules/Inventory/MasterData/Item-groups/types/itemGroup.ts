export interface ItemGroup {
    id: string;
    code: string;
    name: string;
itemsCount: number
    level: number;
   description?: string
}

export interface Pagination {
     pageIndex: number;
        pageSize?: number;
        search?: string;
        level?: string;
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
   description?: string;
}
