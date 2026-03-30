import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, OperationsMasterResponse } from "../types/OperationsMaster";


export const OperationsMasterService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<OperationsMasterResponse>(
      `/Operations`, { params }
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/Operations/${id}`);
    return data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/Operations`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/Operations/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/Operations/${id}`);
  },

  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(
      `/Operations/Status/${id}`,
      null,
      {
        params: { isActive }
      }
    );
    return data.data;
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/Operations/export-workCenters`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  }

};