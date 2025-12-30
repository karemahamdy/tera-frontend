import axiosWrapper from "@/app/http/axiosWrapper";
import type { AddGroup, GroupApiItem, ItemResponse, pageParams } from "../types/groups";

export const GroupService = {
  async getAll(params: pageParams) {
   
    // const query = new URLSearchParams();
    // query.append("PageIndex", params.pageIndex.toString());
    // if (params.pageSize) query.append("PageSize", params.pageSize.toString());
    // if (params.searchingWord)
    //   query.append("SearchingWord", params.searchingWord);
    // if (params.orderBy) query.append("OrderBy", params.orderBy);
    // if (params.orderDirection)
    //   query.append("OrderDirection", params.orderDirection);

    const resp = await axiosWrapper.get<any>(
      `/Group/GetAllGroup?${params}`
      // `/Group/GetAllGroup?${query.toString()}`
    );
    return resp.data;
  },

  async getById(id: string): Promise<GroupApiItem> {
    const data = await axiosWrapper.get<ItemResponse>(
      `/Group/GetGroupById/${id}`
    );
    return data.data;
  },

  async create(payload: AddGroup) {
    const data = await axiosWrapper.post<any>(`/Group/CreateGroup`, payload);
    return data.data;
  },

  async update(id: string, payload: AddGroup) {
    const data = await axiosWrapper.put<any>(`/Group/${id}`, payload);
    return data.data;
  },
  
  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.post<any>(`/Group/GroupActivation`, {
      id,
      isActive,
    });
    return data.data;
  },
  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/Group/DeleteGroup/${id}`);
  },
};
