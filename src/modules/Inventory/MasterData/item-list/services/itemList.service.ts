import axiosWrapper from "@/app/http/axiosWrapper";
import type { AdditemList, itemListResponse, Pagination } from "../types/itemList";


export const itemListService = {
 async getAll(params: Pagination) {
  const resp = await axiosWrapper.get<itemListResponse>(
    `/item/GetAll?` , { params }
  );
  return resp.data;
},

  async getById(id: string): Promise<AdditemList> {
    const data = await axiosWrapper.get<any>(`/item/${id}`);
    return data.data;
  },

  async create(payload: AdditemList ) {
    const data = await axiosWrapper.post<any>(`/item/create`, payload);
    return data.data;
  },
  async update(id: string, payload: AdditemList) {
    const data = await axiosWrapper.put<any>(`/item/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/item/${id}`);
  },

 async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.patch<any>(`/item/activate-deactivate-item/${id}/${isActive} `, {
      isActive
    });
    return data.data;
  },

 async exportData(payload: any) {
    const data = await axiosWrapper.get<Blob>(`/item/exportItems`, {
      params: payload,
      responseType: "blob",
    });

    return data;
  },
};