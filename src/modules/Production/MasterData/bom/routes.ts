export const BOMRoutes = [
  {
    path: "/bom",
    component: () => import("@/modules/Production/MasterData/bom/pages/BOM.vue"),
    name: "BOM",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
  {
    path: "/bom/create",
    component: () => import("@/modules/Production/MasterData/bom/pages/BOMForm.vue"),
    name: "BOMCreate",
     props: { mode: "create" },
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
   {
    path: "/bom/edit/:id",
    component: () => import("@/modules/Production/MasterData/bom/pages/BOMForm.vue"),
    name: "BOMFormEdit",
      props: (route: any) => ({
      mode: "edit",
      id: route.params.id,
    }),
    meta: {
      hide: true,
      localizedTitle: "BOM",
      permission: null
    },
  },
   {
    path: "/bom/view/:id",
    component: () => import("@/modules/Production/MasterData/bom/pages/BOMForm.vue"),
    name: "BOMFormView",
  props: (route: any) => ({
      mode: "view",
      id: route.params.id,
    }),
      meta: {
      hide: true,
      localizedTitle: "BOM",
      permission: null
    },
  },
];
