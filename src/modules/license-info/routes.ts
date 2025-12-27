export const LicenseRoutes = [
  {
    path: "license-info",
    name: "LicenseInfo",
    component: () => import("@/modules/license-info/pages/LicenseInfo.vue"),
    meta: {
      hide: true,
      localizedTitle: "LicenseInfo",
    },
  },
];
