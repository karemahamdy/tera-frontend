export const RolesPermissionsRoutes = [
  // {
  //   path: "/roles-permissions",
  //   component: () => import("@/modules/roles-permissions/pages/RolesPermissions.vue"),
  //   name: "RolesPermissions",
  //   meta: {
  //     hide: true,
  //     localizedTitle: "Home",
  //   },
  // },
  {
    path: '/roles-permissions/add-group-roles/:id',
    name: 'AddGroupRoles',
    component: () => import('@/modules/roles-permissions/pages/AddGroupRoles.vue'),
    meta: {
      hide: true,
      localizedTitle: "RolesPermissions",
    },
  },
  {
    path: '/roles-permissions/list-group-roles/:id',
    name: 'ListGroupRoles',
    component: () => import('@/modules/roles-permissions/pages/ListGroupRoles.vue'),
    meta: {
      hide: true,
      localizedTitle: "RolesPermissions",
    },
  },

];
