import axiosWrapper from "@/app/http/axiosWrapper";
import type {
  GetRolesAssignedToGroupResponse,
  RemoveRoleFromGroup,
  GetRolesToGroup,
} from "../types/userGroupRoles";

export const GroupRolesService = {
  
  getRolesByGroupId(groupId: string) {
    return axiosWrapper.get<GetRolesAssignedToGroupResponse>(
      `/Group/GetRolesAssignedToGroupById/${groupId}`
    );
  },

  removeRoleFromGroup(payload: RemoveRoleFromGroup) {
    return axiosWrapper.delete(`/Group/RemoveRoleFromGroup`, { data: payload });
  }, 

  async createRolesToGroup(payload: GetRolesToGroup) {
    return axiosWrapper.post('/Group/AssignRolesToGroup', payload);
  },

  updateAssignRolesToGroup(payload: GetRolesToGroup) {
    return axiosWrapper.put(`/Group/UpdateAssignRolesToGroup`, payload);
  },

  async updateRolesToGroup(payload: any) {
    return axiosWrapper.post('/Group/AssignRolesToGroup', payload);
  },

};
