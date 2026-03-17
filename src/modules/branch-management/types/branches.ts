
export interface Branch {
  id: string;
  code: string;
  name: string;
 addressEn?: string;
 addressAr?: string;
  isActive: boolean;
  createAt: string;
}

export interface BranchResponse {
  data: {
    items: Branch[];
    PageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  succeeded: boolean;
  message: string | null;
  statusCode: number;
  errorCode: string | null;
  errors: any;
  id: string | null;
}

export interface AddBranch {
  code: string;
  nameAr: string;
  nameEn: string;
  addressEn?: string;
 addressAr?: string;
  isActive?: boolean;
}
