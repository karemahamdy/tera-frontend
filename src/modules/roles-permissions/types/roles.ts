export interface Pagination {
  "PagenationDto.PageIndex": number;
  "PagenationDto.PageSize": number;
  "PagenationDto.SearchingWord"?: string;
  "PagenationDto.OrderBy"?: string;
  "PagenationDto.OrderDirection"?: "desc" | "asc";
  total: number;
}

export interface PermissionDto {
  name: string;
  screenCode: string;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isView: boolean;
}

export interface RolePayload {
  id?: string;
  name: string;
  description: string;
  permissionDtos: PermissionDto[];
}

export interface RoleListItem {
  id: string;
  name: string;
  discription: string;
  userAssigned: number;
  createAt: string;
}

export interface RoleListResponse {
  data: {
    items: RoleListItem[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface RoleItem {
  id: string;
  name: string;
}

export interface Permission {
  moduleCode: string;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isView: boolean;
  permissionDtos: PermissionDto[];
}

export interface RoleByID {
  id?: string;
  name: string;
  description?: string | null | undefined;
  treeOfPermissions : Permission[]
}