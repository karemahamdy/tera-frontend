import axiosWrapper from "@/app/http/axiosWrapper";
import type { AddBranch, BranchResponse } from "../types/branches";

export const BranchService = {
 async getAll(params: {
  pageIndex: number;
  pageSize?: number;
  searchingWord?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}) {
  const query = new URLSearchParams();
  query.append('PageIndex', params.pageIndex.toString());
  if (params.pageSize) query.append('PageSize', params.pageSize.toString());
  if (params.searchingWord) query.append('SearchingWord', params.searchingWord);
  if (params.orderBy) query.append('OrderBy', params.orderBy);
  if (params.orderDirection) query.append('OrderDirection', params.orderDirection);

  const resp = await axiosWrapper.get<BranchResponse>(
    `/Branch/GetAllBranchs?${query.toString()}`
  );
  return resp.data;
},

  async getById(id: string): Promise<AddBranch> {
    const data = await axiosWrapper.get<any>(`/Branch/${id}`);
    return data.data;
  },

  async create(payload: AddBranch ) {
    const data = await axiosWrapper.post<any>(`/Branch/CreateBranch`, payload);
    return data.data;
  },

 async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.patch<any>(`/Branch/activate-deactivate-branch/${id}`, {
      isActive
    });
    return data.data;
  },

  async update(id: string, payload: AddBranch) {
    const data = await axiosWrapper.put<any>(`/Branch/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/Branch/${id}`);
  },


};