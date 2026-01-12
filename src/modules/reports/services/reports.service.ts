import axiosWrapper from "@/app/http/axiosWrapper";
import type { UserFilterBody, UserResponse } from "../types/reports";

export const UserService = {
  async getUsers(body: UserFilterBody): Promise<UserResponse>  {
    return await axiosWrapper.post("/Reports/user-master-data", body);
  }
};

export const GroupService = {
  async getGroup(body: any): Promise<any>  {
    return await axiosWrapper.post("/Reports/group-master-data", body);
  }
};