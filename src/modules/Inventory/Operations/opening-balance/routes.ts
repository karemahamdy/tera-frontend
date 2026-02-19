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
  {
    path: "/opening-balance/create",
    name: "OpeningBalanceCreate",
    component: () => import("@/modules/Inventory/Operations/opening-balance/pages/OpeningBalanceForm.vue"),
    meta: { permission: null },
    props: { mode: "create" },
  },
  {
    path: "/opening-balance/edit/:id",
    name: "OpeningBalanceEdit",
    component: () => import("@/modules/Inventory/Operations/opening-balance/pages/OpeningBalanceEdit.vue"),
    props: { mode: "view" },
    meta: { permission: null },
  },
  
];
