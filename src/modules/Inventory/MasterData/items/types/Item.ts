export interface Pagination {
  PageIndex: number;
  PageSize: number;
  SearchingWord?: string;
  OrderBy?: string;
  OrderDirection?: "desc" | "asc";
  total: number;
}