import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, workOrderResponse } from "../types/WorkOrder";


export const workOrderService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<workOrderResponse>(
      `/WorkOrder`, { params }
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/WorkOrder/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/WorkOrder`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/WorkOrder/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/WorkOrder/${id}`);
  },

  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(
      `/WorkOrder/Status/${id}`,
      null,
      {
        params: { isActive }
      }
    );
    return data.data;
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(
      `/WorkOrder/export-workOrders`,
      {
        params: payload,
        responseType: "blob",
      }
    );

    return data;
    ;
  }

};