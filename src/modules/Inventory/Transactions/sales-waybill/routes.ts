export const SalesWaybillRoutes = [
  {
    path: "/sales-waybill",
    component: () => import("@/modules/Inventory/Transactions/sales-waybill/pages/SalesWaybill.vue"),
    name: "Sales Waybill",
    meta: {
      hide: true,
      localizedTitle: "Sales Waybill",
      permission: null
    },
  },
  
];
