export const WorkCentersRoutes = [
  {
    path: "/work-centers",
    component: () => import("@/modules/Production/MasterData/work-centers/pages/WorkCenters.vue"),
    name: "WorkCenters",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
  {
    path: "/work-centers/create",
    component: () => import("@/modules/Production/MasterData/work-centers/pages/WorkCentersForm.vue"),
    name: "workCenterCreate",
     props: { mode: "create" },
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
   {
    path: "/work-centers/edit/:id",
    component: () => import("@/modules/Production/MasterData/work-centers/pages/WorkCentersForm.vue"),
    name: "workCenterFormEdit",
      props: (route: any) => ({
      mode: "edit",
      id: route.params.id,
    }),
    meta: {
      hide: true,
      localizedTitle: "WorkCenters",
      permission: null
    },
  },
   {
    path: "/work-centers/view/:id",
    component: () => import("@/modules/Production/MasterData/work-centers/pages/WorkCentersView.vue"),
    name: "workCenterFormView",
  props: (route: any) => ({
      mode: "view",
      id: route.params.id,
    }),
      meta: {
      hide: true,
      localizedTitle: "WorkCenters",
      permission: null
    },
  },
];
