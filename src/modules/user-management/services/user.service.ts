import axiosWrapper from "@/app/http/axiosWrapper";
import type {
  Pagination,
  UserList,
  UserByID,
} from "../types/User";

export const UserService = {
  getList(params: Pagination) {
    return axiosWrapper.get<UserList>("/Users/GetAllUser", { params });
  },

  getById(id: string) {
    return axiosWrapper.get<{ data: UserByID }>(`/Users/${id}`);
  },

  create(payload: UserByID) {
    let data = {
      createRoleDto: payload,
    };
    return axiosWrapper.post<UserByID>("/Users/create", data);
  },

  update(id: string, payload: UserByID) {
    let data = {
      updateRoleDto: payload,
      id: id,
    };
    return axiosWrapper.put<UserByID>(`/Users/${id}`, data);
  },

  delete(id: string) {
    return axiosWrapper.delete(`/Users/Delete/${id}`);
  },


  droplist() {
    return axiosWrapper.get<UserList[]>(`/Users`);
  },
};
