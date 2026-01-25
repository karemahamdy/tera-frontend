<script setup lang="ts">
import type { NavItem } from "@/app/types/navigation";
import SidebarItem from "./SidebarItem.vue";
import logoImg from "@/assets/Header.svg";
import { useUserStore } from "@/app/store/useUserStore";

defineProps<{
  collapsed: boolean;
}>();

const userStore = useUserStore();
const logo = logoImg;

const navItems: NavItem[] = [
  {
    label: "Acces Control",
    icon: "SecurityUser",
    children: [
      { label: "Users Management", route: "/user-management" },
      { label: "User Groups", route: "/user-group" },
      { label: "Branch Management", route: "/branch-management" },
      { label: "Roles Management", route: "/roles-permissions" },
      { label: "Active Sessions", route: "/active-sessions" },
      { label: "Audit Log", route: "/audit-log" },
      {
        label: "Reports",
        children: [
          { label: "User Report", route: "/reports/user" },
          { label: "User Group Report", route: "/reports/user-group" },
          { label: "Permission Report", route: "/reports/permission-report" },
        ],
      },
    ],
  },
  {
    label: "Adminstration",
    icon: "KeySquare",
    children: [{ label: "License Info", route: "/license-info" }],
  },
  {
    label: "Inventory",
    icon: "SecurityUser",
    children: [
      { label: "Warehouses", route: "/warehouses" },
      { label: "Item Groups", route: "/item-groups" },
      { label: "Item List", route: "/item-list" },
      { label: "LDC", route: "/LDC" },
    ],
  }
];

function logout() {
  userStore.logout();
}
</script>

<template>
  <aside :class="[
    'sidebar-bg text-white transition-all duration-200 shadow h-screen',
    collapsed ? 'w-16' : 'w-72',
  ]">
    <!-- HEADER -->
    <div class="h-16 flex items-center px-5 border-b border-gray-200">
      <div class="flex items-center gap-5 w-full">
        <img :src="logo" alt="Logo" width="48" height="48" />
        <div v-if="!collapsed" class="text-lg text-primary-500">TERA ERP</div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="scroll-container overflow-y-auto overflow-x-hidden">
      <div class="px-3 py-4 text-gray-500" v-if="!collapsed">Quick Access</div>

      <!-- NAV -->
      <nav class="p-2 text-gray-500">
        <ul class="space-y-1">
          <!-- Dashboard -->
          <li>
            <router-link to="/home" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5" :activeClass="$i18n.locale === 'ar'
                ? 'active active-link-ar'
                : 'active active-link'
              ">
              <VsxIcon iconName="Element4" :size="24" type="linear" />
              <span v-if="!collapsed">{{ $t("Dashboard") }}</span>
            </router-link>
          </li>

          <!-- Dynamic Items -->
          <SidebarItem v-for="item in navItems" :key="item.label" :item="item" :collapsed="collapsed" :activeClass="$i18n.locale === 'ar'
              ? 'active active-link-ar'
              : 'active active-link'
            " />
        </ul>
      </nav>

      <!-- FOOTER -->
      <div class="p-3 mt-10 space-y-1">
        <button class="w-full p-2 rounded hover:bg-white/5 text-gray-500 flex items-center gap-3">
          <VsxIcon iconName="Setting2" :size="24" type="linear" />
          <span v-if="!collapsed">Settings</span>
        </button>

        <button class="w-full p-2 rounded hover:bg-white/5 text-success-500 flex items-center gap-3">
          <VsxIcon iconName="Headphone" :size="24" type="linear" />
          <span v-if="!collapsed">Help</span>
        </button>

        <button class="w-full p-2 rounded hover:bg-white/5 text-danger-500 flex items-center gap-3" @click="logout">
          <VsxIcon iconName="LogoutCurve" :size="24" type="linear" />
          <span v-if="!collapsed">Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<style lang="scss">
aside {
  height: 100vh;
}

/* slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.parent-ul::before {
  content: "";
  position: absolute;
  top: 2.5rem;
  left: 0.5rem;
  width: 1px;
  height: calc(100% - 4.5rem);
  background-color: var(--color-gray-400);
}

.child-item::before {
  content: "";
  position: absolute;
  left: -1rem;
  top: 0.4rem;
  width: 12px;
  height: 12px;
  border-left: 1px solid var(--color-gray-400);
  border-bottom: 1px solid var(--color-gray-400);
  border-radius: 0 0 0 8px;
}

.parent-ul-ar::before {
  content: "";
  position: absolute;
  top: 2.5rem;
  right: 0.5rem;
  width: 1px;
  height: calc(100% - 4.5rem);
  background-color: var(--color-gray-400);
}

.child-item-ar::before {
  content: "";
  position: absolute;
  right: -1rem;
  top: 0.4rem;
  width: 12px;
  height: 12px;
  border-right: 1px solid var(--color-gray-400);
  border-bottom: 1px solid var(--color-gray-400);
  border-radius: 0 0 8px 0;
}

.scroll-container {
  scrollbar-width: thin;
  height: calc(100vh - 4rem);
}

.active {
  background-color: var(--color-primary-50);
  color: var(--color-primary-500);
  font-weight: bold;
  position: relative;
}

.active-li {
  background-color: var(--color-primary-50);
  color: var(--color-gray-500);
  font-weight: bold;
  position: relative;
  font-size: small;
  border-radius: 12px;
}

.active-link::before {
  content: "";
  position: absolute;
  left: -1rem;
  top: 0;
  width: 12px;
  height: 100%;
  border-radius: 4px;
  background-color: var(--color-primary-500);
}

.active-link-ar::before {
  content: "";
  position: absolute;
  right: -1rem;
  top: 0;
  width: 12px;
  height: 100%;
  border-radius: 4px;
  background-color: var(--color-primary-500);
}

button {
  cursor: pointer;
}
</style>
