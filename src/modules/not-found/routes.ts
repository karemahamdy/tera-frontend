export const notFoundRoutes = [
  {
    path: "/404",
    component: () => import("@/modules/not-found/pages/404.vue"),
    name: "404",
    meta: {
      hide: true,
      localizedTitle: "Home",
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import("@/modules/not-found/pages/404.vue"),
    meta: { permission: null },
  },
];
