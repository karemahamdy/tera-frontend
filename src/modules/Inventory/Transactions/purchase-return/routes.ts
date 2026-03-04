export const PurchaseReturnRoutes = [
  {
    path: "/purchase-return",
    component: () => import("@/modules/Inventory/Transactions/purchase-return/pages/PurchaseReturn.vue"),
    name: "PurchaseReturn",
    meta: {
      hide: true,
      localizedTitle: "Purchase Return",
      permission: null
    },
  },
  {
    path: "/purchase-return/create",
    component: () => import("@/modules/Inventory/Transactions/purchase-return/pages/PurchaseReturnForm.vue"),
    name: "PurchaseReturnCreate",
    meta: {
      hide: true,
      localizedTitle: "PurchaseReturn",
      permission: null
    },
  },
  {
    path: "/purchase-return/edit/:id",
    component: () => import("@/modules/Inventory/Transactions/purchase-return/pages/PurchaseReturnForm.vue"),
    name: "PurchaseReturnEdit",
    props: { mode: "edit" },
    meta: {
      hide: true,
      localizedTitle: "PurchaseReturn",
      permission: null
    },
  },
  {
    path: "/purchase-return/view/:id",
    component: () => import("@/modules/Inventory/Transactions/purchase-return/pages/PurchaseReturnForm.vue"),
    name: "PurchaseReturnView",
    props: { mode: "view" },
    meta: {
      hide: true,
      localizedTitle: "PurchaseReturn",
      permission: null
    },
  },
];
