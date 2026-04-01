import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, workCenterResponse } from "../types/WorkCenters";


export const workCenterService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<workCenterResponse>(
      `/WorkCenters`, { params }
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/WorkCenters/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/WorkCenters`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/WorkCenters/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/WorkCenters/${id}`);
  },

  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(
      `/WorkCenters/activate-deactivate-operation/${id}/${isActive}`,
    );
    return data.data;
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/WorkCenters/export-workCenters`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  }

};