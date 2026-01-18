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
    Object.keys(params).forEach(key => (params[key] === undefined || params[key] === null) && delete params[key]);
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
    Object.keys(params).forEach(key => (params[key] === undefined || params[key] === null) && delete params[key]);
    return await axiosWrapper.post("/Reports/user-master-data/export", payload, { params, responseType: 'blob' });
  }
};

export const GroupService = {
  async getGroup(body: GroupFilterBody): Promise<GroupResponse> {
    const { isActive, isGlobal, pageIndex, pageSize, status, ...payload } = body;
    const params: any = {
      pageIndex,
      pageSize,
      status: status !== undefined ? status : status,
      isGlobal: isGlobal || undefined,
    };
    if (isGlobal !== undefined) params.isGlobal = isGlobal;

    Object.keys(params).forEach(key => (params[key] === undefined || params[key] === null) && delete params[key]);
    return await axiosWrapper.post("/Reports/group-master-data", payload, { params });
  },
  async getGroupExport(body: GroupFilterBody): Promise<any> {
    const { isActive, isGlobal, pageIndex, pageSize, status, ...payload } = body;
    const params: any = {
      pageIndex,
      pageSize,
      status: status !== undefined ? status : status,
    };
    if (isGlobal !== undefined) params.isGlobal = isGlobal;

    Object.keys(params).forEach(key => (params[key] === undefined || params[key] === null) && delete params[key]);
    return await axiosWrapper.post("/Reports/group-master-data/export", payload, { params, responseType: 'blob' });
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