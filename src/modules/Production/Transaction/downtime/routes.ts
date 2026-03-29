export const DowntimeRoutes = [
  {
    path: "/downtime",
    component: () => import("@/modules/Production/Transaction/downtime/pages/Downtime.vue"),
    name: "Downtime",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
  {
    path: "/downtime/create",
    component: () => import("@/modules/Production/Transaction/downtime/pages/DowntimeForm.vue"),
    name: "DowntimeCreate",
     props: { mode: "create" },
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
   {
    path: "/downtime/edit/:id",
    component: () => import("@/modules/Production/Transaction/downtime/pages/DowntimeForm.vue"),
    name: "DowntimeFormEdit",
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
    path: "/downtime/view/:id",
    component: () => import("@/modules/Production/Transaction/downtime/pages/DowntimeView.vue"),
    name: "DowntimeFormView",
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
