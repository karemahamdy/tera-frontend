import axiosWrapper from "@/app/http/axiosWrapper";
import type { AssignRole, RolesList, UserRole } from "../types/user";

export const UserRolesService = {
  create(payload: AssignRole) {
    return axiosWrapper.post<AssignRole>("/Users/AssingRoleToUser", payload);
  },

  getRolesByUserId(userID: string) {
    return axiosWrapper.get<RolesList>(
      `/Users/GetRolesAssignedToUserById/${userID}`
    );
  },

  delete(userId: string, roleId: string) {
    return axiosWrapper.delete(`/Users/DeleteRoleFromUser/${userId}/${roleId}`);
  },

  getRoleToGroupById(userId: string, roleId: string) {
    return axiosWrapper.get<{ data: UserRole }>(`/Users/GetRoleAssignedToUserById/${userId}/${roleId}`);
  },

  update(payload: AssignRole) {
    let data = {
      ...payload,
      userAccessScope: payload.accessScope,
    }
    return axiosWrapper.put<AssignRole>("/Users/UpdateAssignRolesToUser", data);
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
