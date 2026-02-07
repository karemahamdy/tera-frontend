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
];
