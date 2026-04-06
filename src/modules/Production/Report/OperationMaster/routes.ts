export const OperationReportRoutes = [
  {
    path: "/operation-report",
    component: () => import("@/modules/Production/Report/OperationMaster/pages/OperationReport.vue"),
    name: "OperationReport",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
