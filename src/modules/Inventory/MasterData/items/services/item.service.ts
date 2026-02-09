import axiosWrapper from "@/app/http/axiosWrapper";
import type { Item, ItemByIdResponse } from "../types/Item";

const setFormData = (payload: Item): FormData => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value) && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          const element = value[i];
          if (typeof element === "object" && !(element instanceof File)) {
            console.log(element);
            
            Object.entries(element).forEach(([objKey, objValue]) => {
              formData.append(
                `${key}[${i}].${objKey}`,
                objValue as string | Blob,
              );
            });
          } else {
            formData.append(key, element as string | Blob);
          }
        }
      } else {
        formData.append(key, value as string | Blob);
      }
    }
  });
  return formData;
};

export const ItemService = {
  async getById(id: string): Promise<ItemByIdResponse> {
    const data = await axiosWrapper.get<{ data: ItemByIdResponse }>(
      `/item/${id}`,
    );
    return data.data;
  },

  async create(payload: Item): Promise<Item> {
    const formData = setFormData(payload);
    const data = await axiosWrapper.post<{ data: Item }>(`/item`, formData);
    return data.data;
  },
  async update(id: string, payload: Item): Promise<Item> {
    const formData = setFormData(payload);
    formData.append("id", id);
    const data = await axiosWrapper.put<{ data: Item }>(`/item`, formData);
    return data.data;
  },
};
