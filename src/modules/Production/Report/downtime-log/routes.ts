export const DowntimeLogRoutes = [
  {
    path: "/downtime-log",
    component: () => import("@/modules/Production/Report/downtime-log/pages/DowntimeLog.vue"),
    name: "DowntimeLog",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
