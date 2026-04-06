export const branchesRoutes = [
  {
    path: "/branch-management",
    component: () => import("@/modules/AccessControl/branch-management/pages/BranchManagement.vue"),
    name: "BranchManagement",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
  {
    path: "/branch-management/create",
    name: "BranchManagementCreate",
    component: () => import("@/modules/AccessControl/branch-management/pages/BranchManagementForm.vue"),
    meta: { permission: null },
    props: { mode: "create" },
  },
  {
    path: "/branch-management/edit/:id",
    name: "BranchManagementEdit",
    component: () => import("@/modules/AccessControl/branch-management/pages/BranchManagementForm.vue"),
    props: { mode: "edit" },
    meta: { permission: null },
  },
];
