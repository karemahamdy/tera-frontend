import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, PurchaseReturnResponse } from "../types/PurchaseReturn";


export const PurchaseReturnService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<PurchaseReturnResponse>(
      `/PurchaseReturns`, { params }
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/PurchaseReturns/${id}`);
    return data.data;
  },

  async create(payload: any) {
    console.log(payload);
    
    const data = await axiosWrapper.post<any>(`/PurchaseReturns`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/PurchaseReturns/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/PurchaseReturns/${id}`);
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/purchase-waybill/export-LDCs`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  },

  async getNextNumber(): Promise<any> {
    const data = await axiosWrapper.get<any>(`/PurchaseReturns/next-number`);
    return data.data;
  },
};