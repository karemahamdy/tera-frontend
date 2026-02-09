export const OpeningBalanceRoutes = [
  {
    path: "/opening-balance",
    component: () => import("@/modules/Inventory/Operations/opening-balance/pages/OpeningBalance.vue"),
    name: "OpeningBalance",
    meta: {
      hide: true,
      localizedTitle: "Purchase Waybill",
      permission: null
    },
  },
  
];
