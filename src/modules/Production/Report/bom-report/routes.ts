export const BOMReportRoutes = [
  {
    path: "/bom-report",
    component: () => import("@/modules/Production/Report/bom-report/pages/BOMReport.vue"),
    name: "BOMReport",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
