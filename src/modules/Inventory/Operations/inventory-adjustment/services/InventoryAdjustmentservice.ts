import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, InventoryAdjustmentResponse, InventoryAdjustmentById  } from "../types/InventoryAdjustment";


export const InventoryAdjustmentService = {
  async getAll(params: Pagination) {

    const resp = await axiosWrapper.get<InventoryAdjustmentResponse>(
      `/physicalcount/adjustment/GetAll`, { params }
    );
    return resp.data;
  },

  async getById(id: string): Promise<InventoryAdjustmentById> {
    const data = await axiosWrapper.get<{ data: InventoryAdjustmentById }>(`/physicalcount/adjustment/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/purchase-waybill`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/purchase-waybill/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/physicalcount/adjustment/${id}`);
  },

  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(
      `/purchase-waybill/Status/${id}`,
      null,
      {
        params: { isActive }
      }
    );
    return data.data;
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
  }

};