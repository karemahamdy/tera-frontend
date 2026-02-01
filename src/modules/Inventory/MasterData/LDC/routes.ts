export const LDCRoutes = [
  {
    path: "/LDC",
    component: () => import("@/modules/Inventory/MasterData/LDC/pages/LDC.vue"),
    name: "LDC",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
  {
    path: "/LDC/create",
    component: () => import("@/modules/Inventory/MasterData/LDC/pages/LDCForm.vue"),
    name: "LDCCreate",
     props: { mode: "create" },
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
   {
    path: "/LDC/edit/:id",
    component: () => import("@/modules/Inventory/MasterData/LDC/pages/LDCForm.vue"),
    name: "LDCFormEdit",
     props: { mode: "edit" },
    meta: {
      hide: true,
      localizedTitle: "LDC",
      permission: null
    },
  },
   {
    path: "/LDC/view/:id",
    component: () => import("@/modules/Inventory/MasterData/LDC/pages/LDCForm.vue"),
    name: "LDCFormView",
     props: { mode: "view" },
    meta: {
      hide: true,
      localizedTitle: "LDC",
      permission: null
    },
  },
];
