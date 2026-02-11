export const ItemTransactionsRoutes = [
  {
    path: "/item-transactions",
    component: () => import("@/modules/Inventory/Operations/item-transactions/pages/ItemTransactions.vue"),
    name: "ItemTransactions",
    meta: {
      hide: true,
      localizedTitle: "Item Transactions",
      permission: null
    },
  },
  {
    path: "/item-transactions/create",
    name: "ItemTransactionsCreate",
    component: () => import("@/modules/Inventory/Operations/item-transactions/pages/ItemTransactionsForm.vue"),
    meta: { permission: null },
    props: { mode: "create" },
  },
  {
    path: "/branch-management/edit/:id",
    name: "ItemTransactionsEdit",
    component: () => import("@/modules/Inventory/Operations/item-transactions/pages/ItemTransactionsForm.vue"),
    props: { mode: "edit" },
    meta: { permission: null },
  },
];
