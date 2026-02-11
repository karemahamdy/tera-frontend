export const itemManagementRoutes = [
  {
    path: "/item-management/create",
    name: "ItemManagementCreate",
    component: () =>
      import("@/modules/Inventory/MasterData/items/pages/ItemForm.vue"),
    meta: { permission: null },
    props: { mode: "create" },
  },
  {
    path: "/item-management/edit/:id",
    name: "ItemManagementEdit",
    component: () =>
      import("@/modules/Inventory/MasterData/items/pages/ItemForm.vue"),
    props: { mode: "edit" },
    meta: { permission: null },
  },
];
