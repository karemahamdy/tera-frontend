export const PurchaseReturnRoutes = [
  {
    path: "/purchase-return",
    component: () => import("@/modules/Inventory/Transactions/purchase-return/pages/PurchaseReturn.vue"),
    name: "Purchase Return",
    meta: {
      hide: true,
      localizedTitle: "Purchase Return",
      permission: null
    },
  },
  
];
