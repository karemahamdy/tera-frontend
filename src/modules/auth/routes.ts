export const authRoutes = [
  {
    path: "/auth/login",
    name: "Login",
    meta: { guestOnly: true },
    component: () => import("@/modules/auth/pages/Login.vue"),
  },
];
