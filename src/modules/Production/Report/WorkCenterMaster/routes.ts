export const WorkCenterMasterRoutes = [
  {
    path: "/workcenter-report",
    component: () => import("@/modules/Production/Report/WorkCenterMaster/pages/WorkCenterMaster.vue"),
    name: "WorkCenterReport",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
