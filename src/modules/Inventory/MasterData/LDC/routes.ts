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
      props: (route: any) => ({
      mode: "edit",
      id: route.params.id,
    }),
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
  props: (route: any) => ({
      mode: "view",
      id: route.params.id,
    }),
      meta: {
      hide: true,
      localizedTitle: "LDC",
      permission: null
    },
  },
];
