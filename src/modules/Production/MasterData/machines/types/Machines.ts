export interface Machines {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createAt: string;
}

export interface MachinesResponse {
  data: {
    items: Machines[];
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

export interface Pagination {
  pageIndex: number;
  pageSize?: number;
  searchingWord?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  IsActive?: string;
  WorkCenterId?: string;
}

export type MachineValues = {
  machineCode: string;
  machineName: string;
  machineModel: string;
  workCenterId: string;
  machineCapacity: number | null;
  costPerHour: number | null;
  efficiencyPercentage: number | null;
  overheadPercentage: number | null;
  setupTime: number | null;
  setupCostPerHour: number | null;
  note: string | null;
  isActive: boolean;
 rowVersion?: string;
};