import axiosWrapper from "@/app/http/axiosWrapper";
import type { AddGroup, GroupApiItem, ItemResponse } from "../types/groups";

export const GroupService = {
  async getAll(pageIndex = 1, pageSize = 10) {
    const resp = await axiosWrapper.get<any>(
      `/Group/GetAllGroup?PagenationDto.PageIndex=${pageIndex}&PagenationDto.PageSize=${pageSize}`
    );
    return resp.data;
  },

  async getById(id: string): Promise<GroupApiItem> {
    const data = await axiosWrapper.get<ItemResponse>(`/Group/GetGroupById/${id}`);
    return data.data;
  },

  async create(payload: AddGroup) {
    const data = await axiosWrapper.post<any>(`/Group/CreateGroup`, payload);
    return data.data;
  },

 async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.post<any>(`/Group/GroupActivation`, {
      id,
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