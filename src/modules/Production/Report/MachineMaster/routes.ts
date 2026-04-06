export const MachineReportRoutes = [
  {
    path: "/machine-report",
    component: () => import("@/modules/Production/Report/MachineMaster/pages/MachineReport.vue"),
    name: "MachineReport",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
