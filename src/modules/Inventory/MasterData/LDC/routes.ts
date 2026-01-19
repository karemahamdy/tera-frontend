export const LDCRoutes = [
  {
    path: "/LDC",
    component: () => import("@/modules/Inventory/MasterData/LDC/pages/LDC.vue"),
    name: "LDC",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
