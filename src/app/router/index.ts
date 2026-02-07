import { createRouter, createWebHistory } from "vue-router";
import { authRoutes } from "@/modules/auth/routes.ts";
import { homeRoutes } from "@/modules/home/routes.ts";
import { userGroupRoutes } from "@/modules/user-group/routes";
import { rolesPermissionsRoutes } from "@/modules/roles-permissions/routes";
import { userManagementRoutes } from "@/modules/user-management/routes";
import { auditLogRoutes } from "@/modules/audit-log/routes";
import { activeSessionsRoutes } from "@/modules/active-sessions/routes";
import { notFoundRoutes } from "@/modules/not-found/routes";
import { branchesRoutes } from "@/modules/branch-management/routes";
import { reportsRoutes } from "@/modules/reports/routes";
import { useUserStore } from "@/app/store/useUserStore";
import { LicenseRoutes } from "@/modules/license-info/routes";
import { LDCRoutes } from "@/modules/Inventory/MasterData/LDC/routes";
import { InventoryRoutes } from "@/modules/Inventory/MasterData/warehouses/routes";
import { itemManagementRoutes } from "@/modules/Inventory/MasterData/items/routes";
import { ItemGroupsRoutes } from "@/modules/Inventory/MasterData/Item-groups/routes";
import { ItemListRoutes } from "@/modules/Inventory/MasterData/item-list/routes";
import { PurchaseWaybillRoutes } from "@/modules/Inventory/Transactions/purchase-waybill/routes";
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
      ...branchesRoutes,
      ...rolesPermissionsRoutes,
      ...auditLogRoutes,
      ...activeSessionsRoutes,
      ...reportsRoutes,
      ...LicenseRoutes,
      ...ItemGroupsRoutes,
      ...InventoryRoutes,
      ...LDCRoutes,
      ...itemManagementRoutes,
      ...ItemListRoutes,
      ...PurchaseWaybillRoutes,
      {
        path: "",
        component: () => import("@/sharedComponents/HelloWorld.vue"),
        name: "Dashboard",
        meta: { permission: null },
      },
    ],
  },
  ...notFoundRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const userStore = useUserStore();

  const isAuthenticated = userStore.isAuthenticated;
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "Login" });
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return next({ name: "Home"  });
  }

  const title = to.meta.title as string | undefined;
  document.title = title || defaultTitle;

  next();
});

export default router;
