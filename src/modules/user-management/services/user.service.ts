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
      IsTemporaryPassword: true,
    };
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value as string | Blob);
      }
    });
    return axiosWrapper.post<UserPayload>("/Users/create", formData);
  },

  update(id: string, payload: UserPayload) {
    let data = {
      ...payload,
      UserId: id,
    };
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value as string | Blob);
      }
    });
    return axiosWrapper.put<UserPayload>(`/Users/Update`, formData);
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
