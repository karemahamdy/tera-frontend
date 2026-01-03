import axiosWrapper from "@/app/http/axiosWrapper";
import type {
  GetRolesAssignedToGroupResponse,
  RemoveRoleFromGroupRequest,
  UpdateAssignRolesToGroupRequest,
} from "../types/userGroupRoles";

export const GroupRolesService = {
  getRolesByGroupId(groupId: string) {
    return axiosWrapper.get<GetRolesAssignedToGroupResponse>(
      `/Group/GetRolesAssignedToGroupById/${groupId}`
    );
  },

  removeRoleFromGroup(payload: RemoveRoleFromGroupRequest) {
    return axiosWrapper.delete(`/Group/RemoveRoleFromGroup`, { data: payload });
  },

  updateAssignRolesToGroup(payload: UpdateAssignRolesToGroupRequest) {
    return axiosWrapper.post(`/Group/UpdateAssignRolesToGroup`, payload);
  },

   async getRolesLookups() {
    const resp = await axiosWrapper.get<{ data: any }>('/Lookups/RolesLookups');
    return resp.data; 
  },

  async getBranchLookups() {
    const resp = await axiosWrapper.get<{ data: any }>('/Lookups/BranchLookups');
    return resp.data; 
  },

   async assignRolesToGroup(payload: any) {
    return axiosWrapper.post('/Group/AssignRolesToGroup', payload);
  },
  
  async updateRolesToGroup(payload: any) {
    return axiosWrapper.post('/Group/AssignRolesToGroup', payload);
  },

};
