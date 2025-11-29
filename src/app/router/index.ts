import { createRouter, createWebHistory } from "vue-router";
import { authRoutes } from "@/modules/auth/routes.ts";
import { useUserStore } from "@/app/store/useUserStore";

const defaultTitle = "Tera ERP";

const routes = [
  ...authRoutes,
  {
    path: "/",
    component: () => import("@/app/layouts/DefaultLayout.vue"),
    meta: { requiresAuth: true, permission: null },
    children: [
      {
        path: "",
        component: () => import("@/components/HelloWorld.vue"),
        name: "Dashboard",
        meta: { permission: null },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo({ top: 0, behavior: "smooth" });

  const userStore = useUserStore();

  const isAuthenticated = userStore.isAuthenticated;

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    return next("/auth/login");
  }

  const { title } = to.meta;
  document.title = (title as string) || defaultTitle;

  next();
});

export default router;
