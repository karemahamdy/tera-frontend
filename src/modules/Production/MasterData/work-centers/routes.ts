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
  // {
  //   path: "/WorkCenters/create",
  //   component: () => import("@/modules/Production/MasterData/WorkCenters/pages/WorkCentersForm.vue"),
  //   name: "WorkCentersCreate",
  //    props: { mode: "create" },
  //   meta: {
  //     hide: true,
  //     localizedTitle: "Home",
  //     permission: null
  //   },
  // },
  //  {
  //   path: "/WorkCenters/edit/:id",
  //   component: () => import("@/modules/Production/MasterData/WorkCenters/pages/WorkCentersForm.vue"),
  //   name: "WorkCentersFormEdit",
  //     props: (route: any) => ({
  //     mode: "edit",
  //     id: route.params.id,
  //   }),
  //   meta: {
  //     hide: true,
  //     localizedTitle: "WorkCenters",
  //     permission: null
  //   },
  // },
  //  {
  //   path: "/WorkCenters/view/:id",
  //   component: () => import("@/modules/Production/MasterData/WorkCenters/pages/WorkCentersForm.vue"),
  //   name: "WorkCentersFormView",
  // props: (route: any) => ({
  //     mode: "view",
  //     id: route.params.id,
  //   }),
  //     meta: {
  //     hide: true,
  //     localizedTitle: "WorkCenters",
  //     permission: null
  //   },
  // },
];
