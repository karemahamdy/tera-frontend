import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination, ItemHoldResponse, ReleaseItemPayload, ItemSerialTransactionResponse, ReleaseSerialPayload } from "../types/ItemHold";

export const ItemHoldService = {
  async getAll(params: Pagination) {
    const resp = await axiosWrapper.get<ItemHoldResponse>(`/item-hold`, {
      params,
    });
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/purchase-waybill/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/purchase-waybill`, payload);
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
    await axiosWrapper.delete(`/purchase-waybill/${id}`);
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

  async releaseItem(payload: ReleaseItemPayload ) {
    await axiosWrapper.post<any>(`/item-hold/release-item`, payload);
  },
  async releaseSerial(payload: ReleaseSerialPayload ) {
    await axiosWrapper.post<any>(`/item-hold/release-serial`, payload);
  },

  async getHoldingSerial(ItemId: string, WarehouseId: string, params: Pagination) {
    const resp = await axiosWrapper.get<ItemSerialTransactionResponse>(`/item-hold/serial-holding-items-for-releasing/${ItemId}/${WarehouseId}`, {
      params,
    });
    return resp.data;
  },
};
