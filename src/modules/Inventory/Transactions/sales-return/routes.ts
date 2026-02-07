export const SalesReturnRoutes = [
  {
    path: "/sales-return",
    component: () => import("@/modules/Inventory/Transactions/sales-return/pages/SalesReturn.vue"),
    name: "Sales Return",
    meta: {
      hide: true,
      localizedTitle: "Sales Return",
      permission: null
    },
  },
  
];
