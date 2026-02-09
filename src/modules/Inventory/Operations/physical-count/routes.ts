export const PhysicalCountRoutes = [
  {
    path: "/physical-count",
    component: () => import("@/modules/Inventory/Operations/physical-count/pages/PhysicalCount.vue"),
    name: "PhysicalCountRoutes",
    meta: {
      hide: true,
      localizedTitle: "Purchase Waybill",
      permission: null
    },
  },
  
];
