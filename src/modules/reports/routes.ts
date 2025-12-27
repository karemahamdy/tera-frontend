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
        component: () => import("./pages/UserReport.vue"),
        meta: { permission: null },
      },
    ],
  },
];
