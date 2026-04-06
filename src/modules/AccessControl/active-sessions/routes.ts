export const activeSessionsRoutes = [
  {
    path: "/active-sessions",
    component: () => import("@/modules/AccessControl/active-sessions/pages/ActiveSessions.vue"),
    name: "ActiveSessions",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
