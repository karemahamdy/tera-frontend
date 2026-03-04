import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, SalesReturnResponse } from "../types/SalesReturn";


export const SalesReturnService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<SalesReturnResponse>(
      `/salesreturns`, { params }
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/salesreturns/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/salesreturns`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/salesreturns/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/salesreturns/${id}`);
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/salesreturns/export-LDCs`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  },

  async getNextNumber(): Promise<any> {
    const data = await axiosWrapper.get<any>(`/salesreturns/next-number`);
    return data.data;
  },

};