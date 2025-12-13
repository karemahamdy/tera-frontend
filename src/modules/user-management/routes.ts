export const userManagementRoutes = [
  {
    path: "/user-management",
    component: () => import("@/modules/user-management/pages/UserManagement.vue"),
    name: "userManagement",
    meta: {
      hide: true,
      localizedTitle: " userManagement",
    },
  },
  {
    path: '/roles-permissions/add-group-roles/:id',
    name: 'AddGroupRoles',
    component: () => import('@/modules/roles-permissions/pages/AddGroupRoles.vue'),
    meta: {
      hide: true,
      localizedTitle: "userManagement",
    },
  },
  {
    path: '/roles-permissions/list-group-roles/:id',
    name: 'ListGroupRoles',
    component: () => import('@/modules/roles-permissions/pages/ListGroupRoles.vue'),
    meta: {
      hide: true,
      localizedTitle: "userManagement",
    },
  },

];
