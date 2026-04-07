import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, BOMResponse } from "../types/BOM";


export const BOMService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<BOMResponse>(
      `/Bom`, { params }
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/Bom/${id}`);
    return data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/Bom`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/Bom/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/Bom/${id}`);
  },

  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(
      `/Bom/activate-deactivate-Bom/${id}/${isActive}`,
    );
    return data.data;
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/Bom/export-BOMs`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  }

};