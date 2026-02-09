export const InventoryRequestRoutes = [
  {
    path: "/inventory-request",
    component: () => import("@/modules/Inventory/Transactions/inventory-request/pages/InventoryRequest.vue"),
    name: "InventoryRequest",
    meta: {
      hide: true,
      localizedTitle: "Inventory Request",
      permission: null
    },
  },
];
