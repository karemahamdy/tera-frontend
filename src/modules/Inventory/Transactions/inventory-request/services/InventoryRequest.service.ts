import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, InventoryRequestResponse,  } from "../types/InventoryRequest";


export const InventoryRequestService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<InventoryRequestResponse>(
      `/inventory-request`, { params }
    );
    return resp;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/inventory-request/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/inventory-request`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/inventory-request/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/inventory-request/${id}`);
  },

  async getNextNumber() {
    const data = await axiosWrapper.get<any>(`/inventory-request/next-number`);
    return data.data;
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/inventory-request/export-LDCs`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  }

};