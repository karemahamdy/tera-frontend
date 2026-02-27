import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, SalesWaybillResponse } from "../types/SalesWaybill";


export const SalesWaybillService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<SalesWaybillResponse>(
      `/SalesWaybills`, {
      params,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        for (const key in params) {
          const value = (params as any)[key];
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value);
          }
        }
        return searchParams.toString();
      }
    }
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/SalesWaybills/${id}`);
    return data.data ?? data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/SalesWaybills`, payload);
    return data.data ?? data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/SalesWaybills/${id}`, payload);
    return data.data ?? data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/SalesWaybills/${id}`);
  },

  async getNextNumber() {
    const data = await axiosWrapper.get<any>(`/SalesWaybills/next-number`);
    return data.data ?? data;
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/SalesWaybills/export-LDCs`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
   
  }

};