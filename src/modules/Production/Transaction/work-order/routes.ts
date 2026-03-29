export const WorkOrderTransactionRoutes = [
  {
    path: "/work-orders",
    component: () => import("@/modules/Production/Transaction/work-order/pages/WorkOrder.vue"),
    name: "WorkOrder",
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
  {
    path: "/work-orders/create",
    component: () => import("@/modules/Production/Transaction/work-order/pages/WorkOrderForm.vue"),
    name: "workOrderCreate",
     props: { mode: "create" },
    meta: {
      hide: true,
      localizedTitle: "Home",
      permission: null
    },
  },
   {
    path: "/work-orders/edit/:id",
    component: () => import("@/modules/Production/Transaction/work-order/pages/WorkOrderForm.vue"),
    name: "workOrderFormEdit",
      props: (route: any) => ({
      mode: "edit",
      id: route.params.id,
    }),
    meta: {
      hide: true,
      localizedTitle: "WorkOrder",
      permission: null
    },
  },
   {
    path: "/work-orders/view/:id",
    component: () => import("@/modules/Production/Transaction/work-order/pages/WorkOrderView.vue"),
    name: "workOrderFormView",
  props: (route: any) => ({
      mode: "view",
      id: route.params.id,
    }),
      meta: {
      hide: true,
      localizedTitle: "WorkOrder",
      permission: null
    },
  },
];
