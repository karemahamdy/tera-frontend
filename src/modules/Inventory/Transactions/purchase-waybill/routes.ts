export const PurchaseWaybillRoutes = [
  {
    path: "/purchase-waybill",
    component: () => import("@/modules/Inventory/Transactions/purchase-waybill/pages/PurchaseWaybill.vue"),
    name: "PurchaseWaybill",
    meta: {
      hide: true,
      localizedTitle: "Purchase Waybill",
      permission: null
    },
  },
  
];
