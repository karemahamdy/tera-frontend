export const rolesPermissionsRoutes = [
  {
    path: "/roles-permissions",
    component: () => import("@/modules/roles-permissions/pages/RolesPermissions.vue"),
    name: "RolesPermissions",
    meta: {
      hide: true,
      localizedTitle: "Home",
    },
  },
   {
    path: '/roles-permissions/add-user-roles/:id',
    name: 'AddUserRoles',
    component: () => import('@/modules/roles-permissions/pages/AddUserRoles.vue'),
    meta: {
      hide: true,
      localizedTitle: "RolesPermissions",
    },
  },
  {
    path: '/roles-permissions/list-user-roles/:id',
    name: 'ListUserRoles',
    component: () => import('@/modules/roles-permissions/pages/ListUserRoles.vue'),
    meta: {
      hide: true,
      localizedTitle: "RolesPermissions",
    },
  },
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
