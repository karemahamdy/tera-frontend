import axiosWrapper from "@/app/http/axiosWrapper";
import type { AddWarehouses, warehousesResponse } from "../types/warehouse";
import type { Pagination } from "../types/warehouse";

export const warehousesService = {
  async getAll(params: Pagination) {
    const resp = await axiosWrapper.get<warehousesResponse>(`/Warehouses`, {
      params,
    });
    return resp.data;
  },

  async getById(id: string): Promise<AddWarehouses> {
    const data = await axiosWrapper.get<any>(`/Warehouses/${id}`);
    return data.data || data;
  },

  async create(payload: AddWarehouses) {
    const data = await axiosWrapper.post<any>(`/Warehouses/create`, payload);
    return data.data;
  },
  async update(id: string, payload: AddWarehouses) {
    const data = await axiosWrapper.put<any>(`/Warehouses/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/Warehouses/${id}`);
  },

  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(`/Warehouses/${id}/status?isActive=${isActive}`)
    return data.data;
  },
  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(`/Warehouses/exportWarehouses`, {
      params: payload,
      responseType: "blob",
    });

    return data;
  },
};
