import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, MachinesResponse } from "../types/Machines";


export const MachinesService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<MachinesResponse>(
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
      `/LedgerDetailCard/export-Machiness`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  }

};