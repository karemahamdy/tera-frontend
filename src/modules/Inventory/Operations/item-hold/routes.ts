export const ItemHoldRoutes = [
  {
    path: "/item-hold",
    component: () => import("@/modules/Inventory/Operations/item-hold/pages/ItemHold.vue"),
    name: "ItemHold",
    meta: {
      hide: true,
      localizedTitle: "Item Hold",
      permission: null
    },
  },
  {
    path: "/item-hold/create",
    name: "ItemHoldCreate",
    component: () => import("@/modules/Inventory/Operations/item-hold/pages/ItemHoldForm.vue"),
    meta: { permission: null },
    props: { mode: "create" },
  },
  {
    path: "/branch-hold/:id",
    name: "ItemTransactionsView",
    component: () => import("@/modules/Inventory/Operations/item-hold/pages/ItemHoldForm.vue"),
    props: { mode: "view" },
    meta: { permission: null },
  },
];
