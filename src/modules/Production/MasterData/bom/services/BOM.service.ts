import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, BOMResponse } from "../types/BOM";


export const BOMService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<BOMResponse>(
      `/LedgerDetailCard`, { params }
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/LedgerDetailCard/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/LedgerDetailCard`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/LedgerDetailCard/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/LedgerDetailCard/${id}`);
  },

  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(
      `/LedgerDetailCard/Status/${id}`,
      null,
      {
        params: { isActive }
      }
    );
    return data.data;
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/LedgerDetailCard/export-BOMs`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  }

};