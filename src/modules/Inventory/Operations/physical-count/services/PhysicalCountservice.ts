import axiosWrapper from "@/app/http/axiosWrapper";
import type {
  Pagination,
  PhysicalCountResponse,
  PhysicalCountById,
  PhysicalCountSerial,
  PhysicalCountForm
} from "../types/PhysicalCount";

export const PhysicalCountService = {
  async getAll(params: Pagination) {
    const resp = await axiosWrapper.get<PhysicalCountResponse>(
      `/physicalcount/GetAll`,
      { params },
    );
    return resp.data;
  },

  async getPhysicalCountSerials(headerId: string, lineId?: string) {
    let params = { lineId: lineId };
    const resp = await axiosWrapper.get<{ data: PhysicalCountSerial[] }>(
      `/physicalcount/${headerId}/serials`,
      { params },
    );
    return resp.data;
  },

  async getById(id: string): Promise<PhysicalCountById> {
    const data = await axiosWrapper.get<{ data: PhysicalCountById }>(
      `/physicalcount/${id}`,
    );
    return data.data;
  },

  async create(payload: PhysicalCountForm) {
    const data = await axiosWrapper.post<any>(`/physicalcount`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(
      `/purchase-waybill/${id}`,
      payload,
    );
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/physicalcount/${id}`);
  },

  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(
      `/purchase-waybill/Status/${id}`,
      null,
      {
        params: { isActive },
      },
    );
    return data.data;
  },

  async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(`/purchase-waybill/export-LDCs`, {
      params: payload,
      responseType: "blob",
    });

    return data;
  },
};
