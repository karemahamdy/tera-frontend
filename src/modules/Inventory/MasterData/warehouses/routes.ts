export const InventoryRoutes = [
  {
    path: "/warehouses",
    component: () => import("@/modules/Inventory/MasterData/warehouses/pages/Warehouses.vue"),
    name: "Warehouses",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
