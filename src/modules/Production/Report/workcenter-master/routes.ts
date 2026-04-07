export const WorkCenterMasterRoutes = [
  {
    path: "/workcenter-report",
    component: () => import("@/modules/Production/Report/workcenter-master/pages/WorkCenterMaster.vue"),
    name: "WorkCenterReport",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
