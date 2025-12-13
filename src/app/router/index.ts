import { createRouter, createWebHistory } from "vue-router";
import { authRoutes } from "@/modules/auth/routes.ts";
import { homeRoutes } from "@/modules/home/routes.ts";
import { useUserStore } from "@/app/store/useUserStore";

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
      {
        path: "",
        component: () => import("@/sharedComponents/HelloWorld.vue"),
        name: "Dashboard",
        meta: { permission: null },
      },
      {
        path: "/user-group",
        component: () => import("@/modules/user-group/pages/UserGroup.vue"),
        name: "UserGroup",
        meta: { permission: null },
      },
       {
    path: '/roles-permissions/add-group-roles/:id',
    name: 'AddGroupRoles',
    component: () => import('@/modules/roles-permissions/AddGroupRoles.vue'),
    meta: { permission: null },
  },
    {
    path: '/roles-permissions/list-group-roles/:id',
    name: 'ListGroupRoles',
    component: () => import('@/modules/roles-permissions/ListGroupRoles.vue'),
    meta: { permission: null },
  },
      {
         path: "/system",
        component: () => import("@/sharedComponents/System.vue"),
        name: "System",
        meta: { permission: null },
      }
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
