import axiosWrapper from "@/app/http/axiosWrapper";
import type { Addwarehouses, warehousesResponse } from "../types/LDC";

export const warehousesService = {
 async getAll(params: {
  pageIndex: number;
  pageSize?: number;
  searchingWord?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}) {
  const query = new URLSearchParams();
  query.append('PageIndex', params.pageIndex.toString());
  if (params.pageSize) query.append('PageSize', params.pageSize.toString());
  if (params.searchingWord) query.append('SearchingWord', params.searchingWord);
  if (params.orderBy) query.append('OrderBy', params.orderBy);
  if (params.orderDirection) query.append('OrderDirection', params.orderDirection);

  const resp = await axiosWrapper.get<warehousesResponse>(
    `/warehouses/GetAllwarehousess?${query.toString()}`
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