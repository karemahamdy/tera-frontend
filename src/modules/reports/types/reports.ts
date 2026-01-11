export interface UserFilterBody {
  groupIds?: string[];
  department?: string;
  status?: string;
  accessScope?: number;
  pageIndex: number;
  pageSize: number;
}
