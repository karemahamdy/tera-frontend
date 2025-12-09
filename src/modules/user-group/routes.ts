export const userGroupRoutes = [
  {
    path: "user-group",
    name: "user-group",
    component: () => import("@/modules/user-group/pages/UserGroup.vue"),
    meta: {
      hide: true,
      localizedTitle: "User Groups",
    },
  },
];
