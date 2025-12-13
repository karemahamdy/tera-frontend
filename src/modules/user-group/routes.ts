export const userGroupRoutes = [
  {
    path: "/user-group",
    component: () => import("@/modules/user-group/pages/UserGroup.vue"),
    name: "UserGroup",
    meta: {
      hide: true,
      localizedTitle: "Home",
    },
  },
  {
    path: '/roles-permissions/add-group-roles/:id',
    name: 'AddGroupRoles',
    component: () => import('@/modules/roles-permissions/pages/AddGroupRoles.vue'),
    meta: {
      hide: true,
      localizedTitle: "UserGroup",
    },
  },
  {
    path: '/roles-permissions/list-group-roles/:id',
    name: 'ListGroupRoles',
    component: () => import('@/modules/roles-permissions/pages/ListGroupRoles.vue'),
    meta: {
      hide: true,
      localizedTitle: "UserGroup",
    },
  },

];
