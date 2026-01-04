import axiosWrapper from "@/app/http/axiosWrapper";
import type {
  Pagination,
  UserList,
  UserByID,
  UserPayload,
  PasswordResetForm
} from "../types/User";

export const UserService = {
  getList(params: Pagination) {
    return axiosWrapper.get<UserList>("/Users/GetAllUser", { params });
  },

  getById(id: string) {
    return axiosWrapper.get<{ data: UserByID }>(`/Users/${id}`);
  },

  create(payload: UserPayload) {
    let data = {
      ...payload,
      isTemporaryPassword: true,
    };
    return axiosWrapper.post<UserPayload>("/Users/create", data);
  },

  update(id: string, payload: UserPayload) {
    let data = {
      ...payload,
      id: id,
    };
    return axiosWrapper.put<UserPayload>(`/Users/${id}`, data);
  },

  delete(id: string) {
    return axiosWrapper.delete(`/Users/Delete/${id}`);
  },

  changeStatus(id: string, isActive: boolean) {
    return axiosWrapper.put(`/Users/Status/${id}?isActive=${isActive}`);
  },

  resetPassword(payload: PasswordResetForm) {
    return axiosWrapper.post<PasswordResetForm>(`/Auth/admin/change-password`, payload);
  },

  droplist() {
    return axiosWrapper.get<UserList[]>(`/Users`);
  },
};
