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
import { ItemTransactionsRoutes } from "@/modules/Inventory/Operations/item-transactions/routes";
import { SalesWaybillRoutes } from "@/modules/Inventory/Transactions/sales-waybill/routes";
import { SalesReturnRoutes } from "@/modules/Inventory/Transactions/sales-return/routes";
import { PurchaseReturnRoutes } from "@/modules/Inventory/Transactions/purchase-return/routes";
import { ItemHoldRoutes } from "@/modules/Inventory/Operations/item-hold/routes";
import { InventoryRequestRoutes } from "@/modules/Inventory/Transactions/inventory-request/routes";
import { WarehouseTransactionRoutes } from "@/modules/Inventory/Transactions/warehouse-transaction/routes";
import { PhysicalCountRoutes } from "@/modules/Inventory/Operations/physical-count/routes";
import { InventoryAdjustmentRoutes } from "@/modules/Inventory/Operations/inventory-adjustment/routes";
import { OpeningBalanceRoutes } from "@/modules/Inventory/Operations/opening-balance/routes";
import { WorkCentersRoutes } from "@/modules/Production/MasterData/work-centers/routes";
import { OperationsMasterRoutes } from "@/modules/Production/MasterData/operation-master/routes";
import { MachinesRoutes } from "@/modules/Production/MasterData/machines/routes";
import { BOMRoutes } from "@/modules/Production/MasterData/bom/routes";

const defaultTitle = "Tera ERP";
const routes = [
  ...authRoutes,
  {
    path: "/",
    name: "Layout",
    redirect: "home",
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
      ...ItemTransactionsRoutes,
      ...SalesWaybillRoutes,
      ...SalesReturnRoutes,
      ...PurchaseReturnRoutes,
      ...ItemHoldRoutes,
      ...InventoryRequestRoutes,
      ...WarehouseTransactionRoutes,
      ...PhysicalCountRoutes,
      ...InventoryAdjustmentRoutes,
      ...OpeningBalanceRoutes,
      ...WorkCentersRoutes,
      ...OperationsMasterRoutes,
      ...MachinesRoutes,
      ...BOMRoutes,
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
