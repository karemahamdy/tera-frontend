import axiosWrapper from "@/app/http/axiosWrapper";
import type {
  Pagination,
  OpeningBalanceResponse,
} from "../types/OpeningBalance";

import type { ApiResponse } from "@/app/types/lookups"

export const OpeningBalanceService = {
  async getAll(params: Pagination) {
    const resp = await axiosWrapper.get<OpeningBalanceResponse>(
      `/OpeningBalances`,
      { params },
    );
    return resp.data;
  },

  async getById(id: string): Promise<any> {
    const data = await axiosWrapper.get<any>(`/OpeningBalances/${id}`);
    return data.data;
  },

  async create(payload: any) {
    const data = await axiosWrapper.post<any>(`/OpeningBalances`, payload);
    return data.data;
  },
  async update(id: string, payload: any) {
    const data = await axiosWrapper.put<any>(`/OpeningBalances/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/OpeningBalances/${id}`);
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

  async downloadImportTemplate(): Promise<Blob> {
    const data = await axiosWrapper.get<Blob>(
      `/OpeningBalances/serial-template`,
      {
        responseType: "blob",
      },
    );
    return data;
  },

  parseSerials(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return axiosWrapper.post<ApiResponse<any[]>>(`/OpeningBalances/get-serials-from-file`, formData);
  },
};
