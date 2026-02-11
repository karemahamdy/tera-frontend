export const InventoryRoutes = [
  {
    path: "/warehouses",
    component: () => import("@/modules/Inventory/MasterData/warehouses/pages/Warehouses.vue"),
    name: "Warehouses",
    meta: {
      hide: true,
      localizedTitle: "Warehouses",
      permission: null
    },
  },
  {
    path: "/warehouses/create",
    component: () => import("@/modules/Inventory/MasterData/warehouses/pages/WarehousesForm.vue"),
    name: "WarehousesCreate",
    props: { mode: "create" },
    meta: { permission: null },
  },
  {
    path: "/warehouses/edit/:id",
    component: () => import("@/modules/Inventory/MasterData/warehouses/pages/WarehousesForm.vue"),
    name: "WarehousesEdit",
    props: { mode: "edit" },
    meta: { permission: null },
  },
    {
    path: "/warehouses/view/:id",
    component: () => import("@/modules/Inventory/MasterData/warehouses/pages/WarehousesForm.vue"),
    name: "WarehousesView",
    props: { mode: "view" },
    meta: { permission: null },
  },
];
