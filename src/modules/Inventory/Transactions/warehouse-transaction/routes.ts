export const WarehouseTransactionRoutes = [
  {
    path: "/warehouse-transaction",
    component: () => import("@/modules/Inventory/Transactions/warehouse-transaction/pages/WarehouseTransaction.vue"),
    name: "WarehouseTransaction",
    meta: {
      hide: true,
      localizedTitle: "Warehouse Transaction",
      permission: null
    },
  },
  {
    path: "/warehouse-transaction/create",
    component: () => import("@/modules/Inventory/Transactions/warehouse-transaction/pages/WarehouseTransactionForm.vue"),
    name: "WarehouseTransactionCreate",
    meta: {
      hide: true,
      localizedTitle: "Warehouse Transaction",
      permission: null
    },
  },
];
