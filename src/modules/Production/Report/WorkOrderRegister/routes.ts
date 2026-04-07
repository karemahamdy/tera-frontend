export const WorkOrderReportRoutes = [
  {
    path: "/workorder-report",
    component: () => import("@/modules/Production/Report/WorkOrderRegister/pages/WorkOrderRegister.vue"),
    name: "WorkOrderReport",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
