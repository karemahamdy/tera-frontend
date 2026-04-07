export const OperationActualsRoutes = [
  {
    path: "/operation-actuals",
    component: () => import("@/modules/Production/Report/operation-actuals/pages/OperationActuals.vue"),
    name: "OperationActuals",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
