export const authRoutes = [
  {
    path: "/auth/login",
    name: "Login",
    component: () => import("@/modules/auth/pages/Login.vue"),
  },
];
