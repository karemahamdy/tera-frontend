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
  {
    path: "/purchase-waybill/create",
    component: () => import("@/modules/Inventory/Transactions/purchase-waybill/pages/PurchaseWaybillForm.vue"),
    name: "PurchaseWaybillCreate",
    meta: {
      hide: true,
      localizedTitle: "Purchase Waybill",
      permission: null
    },
  },
];
