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
  // {
  //   path: '/roles-permissions/add-user-roles/:id',
  //   name: 'AddUserRoles',
  //   component: () => import('@/modules/roles-permissions/pages/AddUserRoles.vue'),
  //   meta: {
  //     hide: true,
  //     localizedTitle: "userManagement",
  //   },
  // },
  // {
  //   path: '/roles-permissions/list-user-roles/:id',
  //   name: 'ListUserRoles',
  //   component: () => import('@/modules/roles-permissions/pages/ListUserRoles.vue'),
  //   meta: {
  //     hide: true,
  //     localizedTitle: "userManagement",
  //   },
  // },

];
