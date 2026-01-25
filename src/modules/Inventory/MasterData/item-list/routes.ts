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
  // },
  // {
  //   path: "/item-list/create",
  //   component: () => import("@/modules/Inventory/MasterData/item-list/pages/ItemListForm.vue"),
  //   name: "ItemListCreate",
  //   props: { mode: "create" },
  //   meta: { permission: null },
  // },
  // {
  //   path: "/item-list/edit/:id",
  //   component: () => import("@/modules/Inventory/MasterData/item-list/pages/ItemListForm.vue"),
  //   name: "ItemListEdit",
  //   props: { mode: "edit" },
  //   meta: { permission: null },
  // },
  //   {
  //   path: "/item-list/view",
  //   component: () => import("@/modules/Inventory/MasterData/item-list/pages/ItemListForm.vue"),
  //   name: "ItemListView",
  //   props: { mode: "view" },
  //   meta: { permission: null },
  },
];
