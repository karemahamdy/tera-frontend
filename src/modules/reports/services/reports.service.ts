import axiosWrapper from "@/app/http/axiosWrapper";
import type { GroupFilterBody, GroupResponse, UserFilterBody, UserResponse } from "../types/reports";

export const UserService = {
  async getUsers(body: UserFilterBody): Promise<UserResponse> {
    const { isActive, isGlobal, pageIndex, pageSize, status, accessScope, ...payload } = body;
    const params: any = {
      pageIndex,
      pageSize,
      isActive: isActive !== undefined ? isActive : status,
      isGlobal: isGlobal !== undefined ? isGlobal : accessScope,
    };
    return await axiosWrapper.post("/Reports/user-master-data", payload, { params });
  },
  async getUsersExport(body: UserFilterBody): Promise<any> {
    const { isActive, isGlobal, pageIndex, pageSize, status, accessScope, ...payload } = body;
    const params: any = {
      pageIndex,
      pageSize,
      isActive: isActive !== undefined ? isActive : status,
      isGlobal: isGlobal !== undefined ? isGlobal : accessScope,
    };
    return await axiosWrapper.post("/Reports/user-master-data/export", payload, { params, responseType: 'blob' });
  }
};

export const GroupService = {
  async getGroup(body: GroupFilterBody): Promise<GroupResponse> {
    return await axiosWrapper.post("/Reports/group-master-data", body);
  },
  async getGroupExport(body: GroupFilterBody): Promise<any> {
    return await axiosWrapper.post("/Reports/group-master-data/export", body, { responseType: 'blob' });
  }
};

export const PermissionService = {
  async getPermission(body: any): Promise<any> {
    return await axiosWrapper.post("/Reports/user-permission-matrix", body);
  },
  async getPermissionExport(body: any): Promise<any> {
    return await axiosWrapper.post("/Reports/user-permission-matrix/export", body, { responseType: 'blob' });
  }
};