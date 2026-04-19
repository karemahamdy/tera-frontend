import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, Downtime } from "../types/Downtime";


export const DowntimeService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<Downtime>(
      `/Downtime`, { params }
    );
    return resp;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/Downtime/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/Downtime`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/Downtime/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/Downtime/${id}`);
  },
  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/Downtime/export-workCenters`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  }

};