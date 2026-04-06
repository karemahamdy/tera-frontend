export const reportsRoutes = [
  {
    path: "/reports/",
    name: "Reports",
    redirect: "/reports/user",
    meta: { requiresAuth: true, permission: null },
    children: [
      {
        path: "/reports/user",
        name: "userReport",
        component: () => import("@/modules/AccessControl/reports/pages/UserReport.vue"),
        meta: { permission: null },
      },
      {
        path: "/reports/user-group",
        name: "userGroupReport",
        component: () => import("@/modules/AccessControl/reports/pages/UserGroupReport.vue"),
        meta: { permission: null },
      },
      {
        path: "/reports/permission-report",
        name: "PermissionReport",
        component: () => import("@/modules/AccessControl/reports/pages/PermissionReport.vue"),
        meta: { permission: null },
      },
    ],
  },
];
