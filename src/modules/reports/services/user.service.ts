import axiosWrapper from "@/app/http/axiosWrapper";
import type { UserFilterBody } from "../types/reports";

export const UserService = {
  async getUsers(body: UserFilterBody) {
    return await axiosWrapper.post("/Reports/user-master-data", body);
  }
};
