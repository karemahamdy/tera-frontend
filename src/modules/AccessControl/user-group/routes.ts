export const userGroupRoutes = [
  {
    path: "/user-group",
    component: () => import("@/modules/AccessControl/user-group/pages/UserGroup.vue"),
    name: "UserGroup",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
  {
    path: "/user-group/create",
    name: "UserGroupCreate",
    component: () => import("@/modules/AccessControl/user-group/pages/UserGroupForm.vue"),
    meta: { permission: null },
    props: { mode: "create" },
  },
  {
    path: "/user-group/edit/:id",
    name: "UserGroupEdit",
    component: () => import("@/modules/AccessControl/user-group/pages/UserGroupForm.vue"),
    props: { mode: "edit" },
    meta: { permission: null },
  },
];
