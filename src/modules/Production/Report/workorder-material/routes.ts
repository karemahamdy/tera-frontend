export const WorkOrderMaterialRoutes = [
  {
    path: "/workorder-material",
    component: () => import("@/modules/Production/Report/WorkOrderMaterial/pages/WorkOrderMaterial.vue"),
    name: "WorkOrderMaterial",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
];
