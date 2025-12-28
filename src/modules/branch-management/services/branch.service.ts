import axiosWrapper from "@/app/http/axiosWrapper";
import type { AddBranch, BranchResponse } from "../types/branches";

export const BranchService = {
  async getAll() {
    const resp = await axiosWrapper.get<BranchResponse>(
      `Branch/GetAllBranchs`
    );
    return resp.data;
  },

  async getById(id: string): Promise<BranchResponse> {
    const data = await axiosWrapper.get<any>(`/Branch/${id}`);
    return data.data;
  },

  async create(payload: AddBranch ) {
    const data = await axiosWrapper.post<any>(`/Branch/CreateBranch`, payload);
    return data.data;
  },

//  async toggleActive(id: string, isActive: boolean) {
//     const data = await axiosWrapper.post<any>(`/Branch/BranchActivation`, {
//       id,
//       isActive
//     });
//     return data.data;
//   },

  async update(id: string, payload: AddBranch) {
    const data = await axiosWrapper.put<any>(`/Branch/${id}`, payload);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await axiosWrapper.delete(`/Branch/DeleteBranch/${id}`);
  },

  async toggleActive(id: string, isActive: boolean) {
    const data = await axiosWrapper.post<any>(`/Branch/BranchActivation`, {
      id,
      isActive
    });
    return data.data;
  },

  // async delete(id: string): Promise<void> {
  //   await axiosWrapper.delete(`/Branch/DeleteBranch/${id}`);
  // }
};