export const ItemGroupsRoutes = [
  {
    path: "/item-groups",
    component: () => import("@/modules/Inventory/MasterData/Item-groups/pages/ItemGroups.vue"),
    name: "itemGroups",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
