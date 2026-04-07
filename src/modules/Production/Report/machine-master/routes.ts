export const MachineReportRoutes = [
  {
    path: "/machine-report",
    component: () => import("@/modules/Production/Report/machine-master/pages/MachineReport.vue"),
    name: "MachineReport",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
