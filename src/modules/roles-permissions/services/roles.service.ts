import axiosWrapper from '@/app/http/axiosWrapper';
import type { Pagination, RolePayload, RoleItem, RoleListResponse } from "../types/roles";

export const RoleService = {
  getList(params: Pagination) {
    return axiosWrapper.get<RoleListResponse>("/Role/View", { params });
  },

  getById(id: string) {
    return axiosWrapper.get<RolePayload>(`/Role/GetAllRole/${id}`);
  },

  create(payload: RolePayload) {
    return axiosWrapper.post<RolePayload>("/Role/Create", payload);
  },

  update(id: string, payload: RolePayload) {
    return axiosWrapper.put<RolePayload>(`/Role/Update/${id}`, payload);
  },

  delete(id: string) {
    return axiosWrapper.delete(`/Role/${id}`);
  },

  droplist() {
    return axiosWrapper.get<RoleItem[]>(`/Role/droplist`);
  },
};
