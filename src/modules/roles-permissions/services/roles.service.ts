import axiosWrapper from '@/app/http/axiosWrapper';
import type { Pagination, RolePayload, RoleItem, RoleListResponse, RoleByID, Permission } from "../types/roles";

export const RoleService = {
  getList(params: Pagination) {
    return axiosWrapper.get<RoleListResponse>("/Role/GetAllRole", { params });
  },

  getById(id: string) {
    return axiosWrapper.get<{ data: RoleByID }>(`/Role/${id}`);
  },

  create(payload: RoleByID) {
    let data = {
      createRoleDto: payload
    }
    return axiosWrapper.post<RoleByID>("/Role/Create", data);
  },

  update(id: string, payload: RoleByID) {
    let data = {
      updateRoleDto: payload,
      id: id
    }
    return axiosWrapper.put<RoleByID>(`/Role/${id}`, data);
  },

  delete(id: string) {
    return axiosWrapper.delete(`/Role/${id}`);
  },

  getModuleslist() {
    return axiosWrapper.get<Permission[]>(`/Role/Permissions`);
  },

  droplist() {
    return axiosWrapper.get<RoleItem[]>(`/Role/droplist`);
  },
};
