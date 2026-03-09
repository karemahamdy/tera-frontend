export const InventoryRequestRoutes = [
  {
    path: "/inventory-request",
    component: () => import("@/modules/Inventory/Transactions/inventory-request/pages/InventoryRequest.vue"),
    name: "InventoryRequest",
    meta: {
      hide: true,
      localizedTitle: "Inventory Request",
      permission: null
    },
  },
  {
    path: "/inventory-request/create",
    component: () => import("@/modules/Inventory/Transactions/inventory-request/pages/InventoryRequestForm.vue"),
    name: "InventoryRequestCreate",
    meta: {
      hide: true,
      localizedTitle: "Inventory Request",
      permission: null
    },
  },
  {
    path: "/inventory-request/edit/:id",
    component: () => import("@/modules/Inventory/Transactions/inventory-request/pages/InventoryRequestForm.vue"),
    name: "InventoryRequestFormEdit",
    meta: {
      hide: true,
      localizedTitle: "Inventory Request",
      permission: null
    },
  },
  {
    path: "/inventory-request/view/:id",
    component: () => import("@/modules/Inventory/Transactions/inventory-request/pages/InventoryRequestForm.vue"),
    name: "InventoryRequestFormView",
    meta: {
      hide: true,
      localizedTitle: "Inventory Request",
      permission: null
    },
  },
];
