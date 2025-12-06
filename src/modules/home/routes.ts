export const homeRoutes = [
  {
    path: "home",
    name: "home",
    component: () => import("@/modules/home/pages/Dashboard.vue"),
    meta: {
      hide: true,
      localizedTitle: "Home",
    },
  },
];
