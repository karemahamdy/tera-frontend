export const homeRoutes = [
  {
    path: "home",
    name: "Home",
    component: () => import("@/modules/home/pages/Dashboard.vue"),
    meta: {
      hide: true,
      localizedTitle: "Home",
    },
  },
];
