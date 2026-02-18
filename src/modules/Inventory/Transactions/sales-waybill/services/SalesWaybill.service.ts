import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, SalesWaybillResponse } from "../types/SalesWaybill";


export const SalesWaybillService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<SalesWaybillResponse>(
      `/SalesWaybills`, { params }
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/SalesWaybills/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/SalesWaybills`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/SalesWaybills/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/SalesWaybills/${id}`);
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
    ;
  }

};