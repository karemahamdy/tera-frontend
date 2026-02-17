import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, WarehouseTransactionResponse } from "../types/WarehouseTransaction";


export const WarehouseTransactionService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<WarehouseTransactionResponse>(
      `/warehouse-transactions`, { params }
    );
    return resp;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/warehouse-transactions/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/warehouse-transactions`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/warehouse-transactions/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/warehouse-transactions/${id}`);
  },
  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/warehouse-transactions/export-LDCs`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  }

};