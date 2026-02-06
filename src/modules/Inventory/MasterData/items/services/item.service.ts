import axiosWrapper from "@/app/http/axiosWrapper";
import type { Item } from "../types/Item";

export const ItemService = {
  async getById(id: string): Promise<Item> {
    const data = await axiosWrapper.get<{ data: Item }>(`/item/${id}`);
    return data.data;
  },

  async create(payload: Item): Promise<Item> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value as string | Blob);
      }
    });
    const data = await axiosWrapper.post<{ data: Item }>(`/item`, formData);
    return data.data;
  },
  async update(id: string, payload: Item): Promise<Item> {
    const formData = new FormData();
    formData.append("id", id);
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value as string | Blob);
      }
    });
    const data = await axiosWrapper.put<{ data: Item }>(`/item`, formData);
    return data.data;
  },
};
