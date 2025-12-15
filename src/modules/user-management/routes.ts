export const userManagementRoutes = [
  {
    path: "/user-management",
    component: () => import("@/modules/user-management/pages/UserManagement.vue"),
    name: "UserManagement",
    meta: {
      hide: true,
      localizedTitle: " UserManagement",
    },
  },
 {
    path: "/user-management/create",
    name: "UserManagementCreate",
    component: () => import("@/modules/user-management/pages/UserManagementForm.vue"),
    meta: { permission: null },
    props: { mode: "create" },
  },
  {
    path: "/user-management/edit/:id",
    name: "UserManagementEdit",
    component: () => import("@/modules/user-management/pages/UserManagementForm.vue"),
    props: { mode: "edit" },
    meta: { permission: null },
  },

];
