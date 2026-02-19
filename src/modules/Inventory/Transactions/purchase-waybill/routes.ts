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
  {
    path: "/purchase-waybill/:id/view",
    component: () => import("@/modules/Inventory/Transactions/purchase-waybill/pages/PurchaseWaybillForm.vue"),
    name: "PurchaseWaybillView",
    props: true,
    meta: {
      hide: true,
      localizedTitle: "Purchase Waybill",
      permission: null
    },
  },
  {
    path: "/purchase-waybill/:id/edit",
    component: () => import("@/modules/Inventory/Transactions/purchase-waybill/pages/PurchaseWaybillForm.vue"),
    name: "PurchaseWaybillEdit",
    props: true,
    meta: {
      hide: true,
      localizedTitle: "Purchase Waybill",
      permission: null
    },
  },
];
