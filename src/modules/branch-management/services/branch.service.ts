import axiosWrapper from "@/app/http/axiosWrapper";
import type { AddBranch } from "../types/branches";

export const BranchService = {
  // async getAll(pageIndex = 1, pageSize = 10) {
  //   const resp = await axiosWrapper.get<any>(
  //     `/Branch/GetAllBranch?PagenationDto.PageIndex=${pageIndex}&PagenationDto.PageSize=${pageSize}`
  //   );
  //   return resp.data;
  // },

  // async getById(id: string): Promise<BranchApiItem> {
  //   const data = await axiosWrapper.get<ItemResponse>(`/Branch/GetBranchById/${id}`);
  //   return data.data;
  // },

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
    const data = await axiosWrapper.put<any>(`/Branch/UpdateBranch/${id}`, payload);
    return data.data;
  },

  // async delete(id: string): Promise<void> {
  //   await axiosWrapper.delete(`/Branch/DeleteBranch/${id}`);
  // }
};