export const ProductionReceiptRoutes = [
  {
    path: "/production-receipt",
    component: () => import("@/modules/Production/Report/production-receipt/pages/ProductionReceipt.vue"),
    name: "ProductionReceipt",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
