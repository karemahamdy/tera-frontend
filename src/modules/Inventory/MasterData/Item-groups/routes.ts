export const ItemGroupsRoutes = [
  {
    path: "/item-groups",
    name: "itemGroups",
    component: () =>
      import("@/modules/Inventory/MasterData/Item-groups/pages/ItemGroups.vue"),
    meta: { hide: true, permission: null },
  },
  {
    path: "/item-groups/create",
    name: "ItemGroupsCreate",
    component: () =>
      import("@/modules/Inventory/MasterData/Item-groups/pages/ItemGroupsForm.vue"),
    props: (route: any) => ({
      mode: "create",
      level: Number(route.query.level || 1),
    }),
    meta: { permission: null },
  },
  {
    path: "/item-groups/edit/:id",
    name: "ItemGroupsEdit",
    component: () =>
      import("@/modules/Inventory/MasterData/Item-groups/pages/ItemGroupsForm.vue"),
    props: (route: any) => ({
      mode: "edit",
      level: Number(route.query.level || 1),
    }),
    meta: { permission: null },
  },
];
