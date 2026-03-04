export const SalesReturnRoutes = [
  {
    path: "/sales-return",
    component: () =>
      import("@/modules/Inventory/Transactions/sales-return/pages/SalesReturn.vue"),
    name: "Sales Return",
    meta: {
      hide: true,
      localizedTitle: "Sales Return",
      permission: null,
    },
  },
  {
    path: "/sales-return/create",
    component: () =>
      import("@/modules/Inventory/Transactions/sales-return/pages/SalesReturnForm.vue"),
    name: "SalesReturnCreate",
    props: { mode: "create" },
    meta: {
      hide: true,
      localizedTitle: "Sales Return",
      permission: null,
    },
  },
  {
    path: "/sales-return/edit/:id",
    component: () =>
      import("@/modules/Inventory/Transactions/sales-return/pages/SalesReturnForm.vue"),
    name: "SalesReturnEdit",
    props: { mode: "edit" },
    meta: {
      hide: true,
      localizedTitle: "Sales Return",
      permission: null,
    },
  },
  {
    path: "/sales-return/view/:id",
    component: () =>
      import("@/modules/Inventory/Transactions/sales-return/pages/SalesReturnForm.vue"),
    name: "SalesReturnView",
    props: { mode: "view" },
    meta: {
      hide: true,
      localizedTitle: "Sales Return",
      permission: null,
    },
  },
];
