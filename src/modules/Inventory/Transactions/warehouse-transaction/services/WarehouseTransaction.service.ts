import axiosWrapper from "@/app/http/axiosWrapper";
import type {
  Pagination,
  WarehouseTransactionResponse,
} from "../types/WarehouseTransaction";

export const WarehouseTransactionService = {
  async getAll(params: Pagination) {
    const resp = await axiosWrapper.get<WarehouseTransactionResponse>(
      `/warehouse-transactions`,
      {
        params,
        paramsSerializer: (params) => {
          const searchParams = new URLSearchParams();
          for (const key in params) {
            const value = (params as any)[key];
            if (Array.isArray(value)) {
              value.forEach((v) => searchParams.append(key, v));
            } else if (value !== undefined && value !== null && value !== "") {
              searchParams.append(key, value);
            }
          }
          return searchParams.toString();
        },
      },
    );

    return resp;
  },
  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/warehouse-transactions/${id}`);
    return data.data ?? data;
  },
  async create(payload: any) {
    const data = await axiosWrapper.post<any>(
      `/warehouse-transactions`,
      payload,
    );
    return data.data ?? data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(
      `/warehouse-transactions/${id}`,
      payload,
    );
    return data.data ?? data;
  },
  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/warehouse-transactions/${id}`);
  },
  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/warehouse-transactions/export-warehouse`,
      {
        params: payload,
        responseType: "blob",
      },
    );
    return data;
  },
  async getInventoryRequestById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(
      `/warehouse-transactions/Get-InventoryRequest/${id}`,
    );
    return data.data ?? data;
  },
  async getNextNumber() {
    const data = await axiosWrapper.get<any>(`/warehouse-transactions/next-number`);
    return data.data;
  },
};
