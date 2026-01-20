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
  {
    path: "/LDC/create",
    component: () => import("@/modules/Inventory/MasterData/LDC/pages/LDCForm.vue"),
    name: "LDCForm",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
