import axiosWrapper from "@/app/http/axiosWrapper";
import type { GroupFilterBody, GroupResponse, UserFilterBody, UserResponse } from "../types/reports";

export const UserService = {
  async getUsers(body: UserFilterBody): Promise<UserResponse> {
    return await axiosWrapper.post("/Reports/user-master-data", body);
  },
  async getUsersExport(body: UserFilterBody): Promise<any> {
    return await axiosWrapper.post("/Reports/user-master-data/export", body, { responseType: 'blob' });
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