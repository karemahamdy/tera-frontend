export const auditLogRoutes = [
  {
    path: "/audit-log",
    component: () => import("@/modules/audit-log/pages/AuditLog.vue"),
    name: "AuditLog",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
