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
];
