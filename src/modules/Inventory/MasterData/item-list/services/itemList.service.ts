import axiosWrapper from "@/app/http/axiosWrapper";
import type { AdditemList, itemListResponse } from "../types/itemList";
import type { pagination } from "../../item-groups/types/itemGroup";

export const itemListService = {
 async getAll(params: pagination) {
  const resp = await axiosWrapper.get<itemListResponse>(
    `/itemList/GetAllitemLists?${params}`
  );
  return resp.data;
},

  async getById(id: string): Promise<AdditemList> {
    const data = await axiosWrapper.get<any>(`/itemList/${id}`);
    return data.data;
  },

  async create(payload: AdditemList ) {
    const data = await axiosWrapper.post<any>(`/itemList/create`, payload);
    return data.data;
  },
  async update(id: string, payload: AdditemList) {
    const data = await axiosWrapper.put<any>(`/itemList/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/itemList/${id}`);
  },

 async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.put<any>(`/itemList/${id}/status `, {
      isActive
    });
    return data.data;
  },


};