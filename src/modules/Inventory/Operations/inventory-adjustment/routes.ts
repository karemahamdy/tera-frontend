export const InventoryAdjustmentRoutes = [
  {
    path: "/inventory-adjustment",
    component: () => import("@/modules/Inventory/Operations/inventory-adjustment/pages/InventoryAdjustment.vue"),
    name: "InventoryAdjustment",
    meta: {
      hide: true,
      localizedTitle: "Purchase Waybill",
      permission: null
    },
  },
  
];
