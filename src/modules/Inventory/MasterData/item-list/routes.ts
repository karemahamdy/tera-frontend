export const ItemListRoutes = [
  {
    path: "/item-list",
    component: () => import("@/modules/Inventory/MasterData/item-list/pages/ItemList.vue"),
    name: "ItemList",
    meta: {
      hide: true,
      localizedTitle: "ItemList",
      permission: null
    },
  },
  {
    path: "/item-list/view/:id",
    component: () => import("@/modules/Inventory/MasterData/item-list/pages/ItemView.vue"),
    name: "ItemView",
    props: { mode: "view" },
    meta: { permission: null },
  },
];
