export const OperationsMasterRoutes = [
  {
    path: "/operation-master",
    component: () => import("@/modules/Production/MasterData/operation-master/pages/OperationsMaster.vue"),
    name: "OperationsMaster",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
  {
    path: "/operation-master/create",
    component: () => import("@/modules/Production/MasterData/operation-master/pages/OperationsMasterForm.vue"),
    name: "OperationsMasterCreate",
     props: { mode: "create" },
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
   {
    path: "/operation-master/edit/:id",
    component: () => import("@/modules/Production/MasterData/operation-master/pages/OperationsMasterForm.vue"),
    name: "OperationsMasterFormEdit",
      props: (route: any) => ({
      mode: "edit",
      id: route.params.id,
    }),
    meta: {
      hide: true,
      localizedTitle: "OperationsMaster",
      permission: null
    },
  },
   {
    path: "/operation-master/view/:id",
    component: () => import("@/modules/Production/MasterData/operation-master/pages/OperationsMasterView.vue"),
    name: "OperationsMasterFormView",
  props: (route: any) => ({
      mode: "view",
      id: route.params.id,
    }),
      meta: {
      hide: true,
      localizedTitle: "OperationsMaster",
      permission: null
    },
  },
];
