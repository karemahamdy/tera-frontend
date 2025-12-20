import axiosWrapper from "@/app/http/axiosWrapper";
import type { AddGroup, GroupApiItem } from "../types/groups";

export const GroupService = {
  async getAll(pageIndex = 1): Promise<GroupApiItem[]> {
    const data = await axiosWrapper.get(
      `/Group/GetAllGroup?PagenationDto.PageIndex=${pageIndex}`
    );
    return data.data.items;
  },

  async getById(id: string): Promise<GroupApiItem> {
    const data = await axiosWrapper.get(`/Group/GetGroupById?Id=${id}`);
    return data.data;
  },

  async create(payload: AddGroup) {
    const data = await axiosWrapper.post(`/Group/CreateGroup`, payload);
    return data.data;
  },

  async update(id: string, payload: AddGroup) {
    const data = await axiosWrapper.put(`/Group/UpdateGroup/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/Group/DeleteGroup/${id}`);
  }
};