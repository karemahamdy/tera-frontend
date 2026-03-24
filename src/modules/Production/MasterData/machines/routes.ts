export const MachinesRoutes = [
  {
    path: "/machines",
    component: () => import("@/modules/Production/MasterData/machines/pages/Machines.vue"),
    name: "Machines",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
  {
    path: "/machines/create",
    component: () => import("@/modules/Production/MasterData/machines/pages/MachinesForm.vue"),
    name: "MachinesCreate",
     props: { mode: "create" },
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
   {
    path: "/machines/edit/:id",
    component: () => import("@/modules/Production/MasterData/machines/pages/MachinesForm.vue"),
    name: "MachinesFormEdit",
      props: (route: any) => ({
      mode: "edit",
      id: route.params.id,
    }),
    meta: {
      hide: true,
      localizedTitle: "Machines",
      permission: null
    },
  },
   {
    path: "/machines/view/:id",
    component: () => import("@/modules/Production/MasterData/machines/pages/MachinesView.vue"),
    name: "MachinesFormView",
  props: (route: any) => ({
      mode: "view",
      id: route.params.id,
    }),
      meta: {
      hide: true,
      localizedTitle: "Machines",
      permission: null
    },
  },
];
