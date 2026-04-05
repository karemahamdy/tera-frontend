import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, MachinesResponse } from "../types/Machines";


export const MachinesService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<MachinesResponse>(
      `/Machines`, { params }
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/Machines/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/Machines`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/Machines/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/Machines/${id}`);
  },

  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(
      `/Machines/activate-deactivate-Machine/${id}/${isActive}`,
    );
    return data.data;
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/Machines/export-Machiness`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  }

};