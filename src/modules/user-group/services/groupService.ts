import axiosWrapper from "@/app/http/axiosWrapper";
import type { AddGroup, GroupApiItem, ListResponse, ItemResponse } from "../types/groups";

export const GroupService = {
  async getAll(pageIndex = 1): Promise<GroupApiItem[]> {
    const data = await axiosWrapper.get<ListResponse>(
      `/Group/GetAllGroup?PagenationDto.PageIndex=${pageIndex}`
    );
    return data.data.items;
  },

  async getById(id: string): Promise<GroupApiItem> {
    const data = await axiosWrapper.get<ItemResponse>(`/Group/GetGroupById/${id}`);
    return data.data;
  },

  async create(payload: AddGroup) {
    const data = await axiosWrapper.post<any>(`/Group/CreateGroup`, payload);
    return data.data;
  },

 async toggleActive(groupId: string, isActive: boolean) {
    const data = await axiosWrapper.post<any>(`/Group/GroupActivation`, {
      groupId,
      isActive
    });
    return data.data;
  },

  async update(id: string, payload: AddGroup) {
    const data = await axiosWrapper.put<any>(`/Group/UpdateGroup/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/Group/DeleteGroup/${id}`);
  }
};