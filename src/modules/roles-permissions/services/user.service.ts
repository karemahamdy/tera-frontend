import axiosWrapper from "@/app/http/axiosWrapper";
import type { AssignRole } from "../types/user";

export const UserRolesService = {
  create(payload: AssignRole) {
    return axiosWrapper.post<AssignRole>("/Users/AssingRoleToUser", payload);
  },

  // getList(params: Pagination) {
  //   return axiosWrapper.get<RoleListResponse>("/Role/GetAllRole", { params });
  // },

  // getById(id: string) {
  //   return axiosWrapper.get<{ data: RoleByID }>(`/Role/${id}`);
  // },

  // update(id: string, payload: RoleByID) {
  //   let data = {
  //     updateRoleDto: payload,
  //     id: id,
  //   };
  //   return axiosWrapper.put<RoleByID>(`/Role/${id}`, data);
  // },

  // delete(id: string) {
  //   return axiosWrapper.delete(`/Role/${id}`);
  // },
};
