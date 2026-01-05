import axiosWrapper from "@/app/http/axiosWrapper";
import type {
  GetRolesAssignedToGroupResponse,
  RemoveRoleFromGroup,
  GetRolesToGroup,
  GroupRoleDetails,
} from "../types/userGroupRoles";
import { date } from "yup";

export const GroupRolesService = {

  getRolesByGroupId(groupId: string) {
    return axiosWrapper.get<GetRolesAssignedToGroupResponse>(
      `/Group/GetRolesAssignedToGroupById/${groupId}`
    );
  },

  removeRoleFromGroup(payload: RemoveRoleFromGroup) {
    return axiosWrapper.delete<any>(`/Group/RemoveRoleFromGroup`, { data: payload });
  }, 

  async createRolesToGroup(payload: GetRolesToGroup) {
    return axiosWrapper.post<any>('/Group/AssignRolesToGroup', payload);
  },

  getRoleToGroupById(groupId: string, roleId: string) {
  return axiosWrapper.get<{data: GroupRoleDetails}>(
    `/Group/GetRoleAssignedToGroupById/${groupId}/${roleId}`
  );
},

  async updateRolesToGroup(payload: any) {
    return axiosWrapper.put<any>('/Group/UpdateAssignRolesToGroup', payload);
  },

};
