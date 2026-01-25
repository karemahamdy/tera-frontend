import axiosWrapper from "@/app/http/axiosWrapper";
import type { Addwarehouses, warehousesResponse } from "../types/warehouse";
import type { Pagination } from "../types/warehouse";

export const warehousesService = {
 async getAll(params: Pagination) {
  const resp = await axiosWrapper.get<warehousesResponse>(
    `/warehouses/GetAllwarehousess?${params}`
  );
  return resp.data;
},

  async getById(id: string): Promise<Addwarehouses> {
    const data = await axiosWrapper.get<any>(`/warehouses/${id}`);
    return data.data;
  },

  async create(payload: Addwarehouses ) {
    const data = await axiosWrapper.post<any>(`/warehouses/create`, payload);
    return data.data;
  },
  async update(id: string, payload: Addwarehouses) {
    const data = await axiosWrapper.put<any>(`/warehouses/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/warehouses/${id}`);
  },

 async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(`/warehouses/${id}/status `, {
      isActive
    });
    return data.data;
  },


};