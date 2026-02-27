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
  {
    path: "/sales-waybill/create",
    component: () => import("@/modules/Inventory/Transactions/sales-waybill/pages/SalesWaybillForm.vue"),
    name: "SalesWaybillCreate",
    meta: {
      hide: true,
      localizedTitle: "Sales Waybill",
      permission: null
    },
  },
  {
    path: "/sales-waybill/:id/view",
    component: () => import("@/modules/Inventory/Transactions/sales-waybill/pages/SalesWaybillForm.vue"),
    name: "SalesWaybillView",
    props: true,
    meta: {
      hide: true,
      localizedTitle: "Sales Waybill",
      permission: null
    },
  },
  {
    path: "/sales-waybill/:id/edit",
    component: () => import("@/modules/Inventory/Transactions/sales-waybill/pages/SalesWaybillForm.vue"),
    name: "SalesWaybillEdit",
    props: true,
    meta: {
      hide: true,
      localizedTitle: "Sales Waybill",
      permission: null
    },
  },
];
