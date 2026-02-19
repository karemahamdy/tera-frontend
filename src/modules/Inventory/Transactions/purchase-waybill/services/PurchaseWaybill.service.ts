import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, PurchaseWaybillResponse,  } from "../types/PurchaseWaybill";


export const PurchaseWaybillService = {
  async getAll(params: Pagination) {
    const resp = await axiosWrapper.get<PurchaseWaybillResponse>(
      `/PurchaseWaybills`, { 
        params ,
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
    const data = await axiosWrapper.get<any>(`/PurchaseWaybills/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/PurchaseWaybills`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/PurchaseWaybills/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/PurchaseWaybills/${id}`);
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/PurchaseWaybills/export-LDCs`,
      {
        params: payload,
        responseType: "blob",
      }
    );
    return data;
  },
 async getNextNumber() {
    const data = await axiosWrapper.get<any>(`/PurchaseWaybills/next-number`);
    return data.data;
  },
};