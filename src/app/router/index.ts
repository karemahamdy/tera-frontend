import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/app/store/useUserStore";
import { authRoutes } from "@/modules/auth/routes.ts";
import { homeRoutes } from "@/modules/home/routes.ts";
import { userGroupRoutes } from "@/modules/user-group/routes";
import { rolesPermissionsRoutes } from "@/modules/roles-permissions/routes";
import { userManagementRoutes } from "@/modules/user-management/routes";

const defaultTitle = "Tera ERP";

const routes = [
  ...authRoutes,
  {
    path: "/",
    name: "Layout",
    redirect: "/home",
    component: () => import("@/app/layouts/DefaultLayout.vue"),
    meta: { requiresAuth: true, permission: null },
    children: [
      ...homeRoutes,
      ...userManagementRoutes,
       ...userGroupRoutes,
       ...rolesPermissionsRoutes,
      {
        path: "",
        component: () => import("@/sharedComponents/HelloWorld.vue"),
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

// router.beforeEach((to, from, next) => {
//   window.scrollTo({ top: 0, behavior: "smooth" });

//   const userStore = useUserStore();

//   const isAuthenticated = userStore.isAuthenticated;

//   if (
//     to.matched.some((record) => record.meta.requiresAuth) &&
//     !isAuthenticated
//   ) {
//     return next("/auth/login");
//   }

//   const { title } = to.meta;
//   document.title = (title as string) || defaultTitle;

//   next();
// });

export default router;
