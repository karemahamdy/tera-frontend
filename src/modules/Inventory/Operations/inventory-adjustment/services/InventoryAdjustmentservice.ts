import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, InventoryAdjustmentResponse, InventoryAdjustmentById, CreateInventoryAdjustmentPayload, PhysicalCountItem  } from "../types/InventoryAdjustment";


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

  async create(payload: CreateInventoryAdjustmentPayload) {
    const physicalCountHeaderIds = payload.physicalCountHeaderIds.map(item => item.countedId);
    const apiPayload = { ...payload, physicalCountHeaderIds };
    const data = await axiosWrapper.post<any>(`/physicalcount/adjustment`, apiPayload);
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
  },

  async getPhysicalCountsForAdjustmentByItem() {
    const data = await axiosWrapper.get<{ data: PhysicalCountItem[] }>(`/physicalcount/physicalcounts-for-adjustment-by-item`);
    return data.data;
  }

};