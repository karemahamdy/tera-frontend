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
  {
    path: "/inventory-adjustment/create",
    name: "InventoryAdjustmentCreate",
    component: () => import("@/modules/Inventory/Operations/inventory-adjustment/pages/InventoryAdjustmentForm.vue"),
    meta: { permission: null },
    props: { mode: "create" },
  },
  {
    path: "/branch-management/view/:id",
    name: "InventoryAdjustmentView",
    component: () => import("@/modules/Inventory/Operations/inventory-adjustment/pages/InventoryAdjustmentView.vue"),
    props: { mode: "view" },
    meta: { permission: null },
  },
];
