export const ProductionReceiptsRoutes = [
  {
    path: "/production-receipts",
    component: () => import("@/modules/Production/Transaction/production-receipts/pages/ProductionReceipts.vue"),
    name: "ProductionReceipts",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
  {
    path: "/production-receipts/create",
    component: () => import("@/modules/Production/Transaction/production-receipts/pages/ProductionReceiptsForm.vue"),
    name: "ProductionReceiptsCreate",
     props: { mode: "create" },
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
   {
    path: "/production-receipts/edit/:id",
    component: () => import("@/modules/Production/Transaction/production-receipts/pages/ProductionReceiptsForm.vue"),
    name: "ProductionReceiptsFormEdit",
      props: (route: any) => ({
      mode: "edit",
      id: route.params.id,
    }),
    meta: {
      hide: true,
      localizedTitle: "ProductionReceipts",
      permission: null
    },
  },
   {
    path: "/production-receipts/view/:id",
    component: () => import("@/modules/Production/Transaction/production-receipts/pages/ProductionReceiptsView.vue"),
    name: "ProductionReceiptsFormView",
  props: (route: any) => ({
      mode: "view",
      id: route.params.id,
    }),
      meta: {
      hide: true,
      localizedTitle: "ProductionReceipts",
      permission: null
    },
  },
];
