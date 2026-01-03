export interface GroupRole {
  groupId: string;
  roleId: string;
  roleName: string;
  groupAccessScope: string;
  branchNames: string[];
}

export interface GetRolesAssignedToGroupResponse {
  data: GroupRole[];
  succeeded: boolean;
  message: string | null;
  statusCode: number;
  errorCode: string | null;
  errors: any | null;
  id: string | null;
}

export interface GroupRoleTableRow {
  roleId: string; 
  groupId: string;
  roleName: string;
  accessScope: string;
  branches: string;
}

export interface RemoveRoleFromGroup {
  groupId: string;
  roleId: string;
}

export interface GetRolesToGroup {
  groupId: string;
  roleId: string[];
  branchIds?: string[];
  accessScope: number;
}
