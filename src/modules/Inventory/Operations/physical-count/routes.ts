export const PhysicalCountRoutes = [
  {
    path: "/physical-count",
    component: () => import("@/modules/Inventory/Operations/physical-count/pages/PhysicalCount.vue"),
    name: "PhysicalCount",
    meta: {
      hide: true,
      localizedTitle: "Purchase Waybill",
      permission: null
    },
  },
  {
    path: "/physical-count/create",
    name: "PhysicalCountCreate",
    component: () => import("@/modules/Inventory/Operations/physical-count/pages/PhysicalCountForm.vue"),
    meta: { permission: null },
    props: { mode: "create" },
  },
  {
    path: "/physical-count/view/:id",
    name: "PhysicalCountView",
    component: () => import("@/modules/Inventory/Operations/physical-count/pages/PhysicalCountView.vue"),
    props: { mode: "view" },
    meta: { permission: null },
  },
  
];
