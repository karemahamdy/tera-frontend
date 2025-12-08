<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { NavItem } from "src/app/types/navigation";
import logoImg from "@/assets/Header.svg";

// Props
const props = defineProps<{
  collapsed: boolean;
}>();

const router = useRouter();
const route = useRoute();
const logo = logoImg;
// Navigation items
const navItems: NavItem[] = [
  { label: "Dashboard", icon: "pi pi-home", route: "/" },
  { label: "Users", icon: "pi pi-users", route: "/users" },
  {
    label: "Acces Control",
    icon: "pi pi-cog",
    children: [
      { label: "Users Management", route: "/settings" },
      { label: "User Groups", route: "/roles" },
      { label: "Branch Management", route: "/roles" },
      { label: "Roles Management", route: "/roles" },
      { label: "Active Sessions", route: "/roles" },
      { label: "Security Settings", route: "/roles" },
      { label: "Audit Log", route: "/roles" },
    ],
  },
];

// track which parent items are open
const open = ref<Record<string, boolean>>({});

function toggle(item: NavItem) {
  if (!item.children) return;
  open.value[item.label] = !open.value[item.label];
}

function isOpen(item: NavItem) {
  return !!open.value[item.label];
}

function isActive(item: NavItem) {
  if (!item.route) return false;
  return route.path === item.route;
}

function logout() {
  router.push("/login");
}
</script>

<template>
  <aside
    :class="[
      'sidebar-bg text-white transition-all duration-200',
      collapsed ? 'w-16' : 'w-64',
    ]"
  >
    <div class="h-16 flex items-center px-5 border-b border-gray-200">
      <div class="flex items-center gap-5 w-full">
        <img :src="logo" alt="Logo" width="48" height="48" />
        <div v-if="!collapsed" class="text-lg text-primary-500">TERA ERP</div>
      </div>
    </div>
    <div class="scroll-container overflow-y-auto">
      <!-- user panel -->
      <div class="px-3 py-4 flex items-center gap-3">
        <div v-if="!collapsed" class="text-gray-500">Quick Access</div>
      </div>
  
      <!-- nav -->
      <nav class="p-2 text-gray-500">
        <ul>
          <li v-for="item in navItems" :key="item.label" class="mb-1">
            <!-- Parent item -->
            <div
              class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 cursor-pointer"
              :class="{ 'bg-white/6': isActive(item) }"
              @click="item.children ? toggle(item) : router.push(item.route!)"
            >
              <i :class="item.icon"></i>
  
              <span v-if="!collapsed" class="flex-1">
                {{ item.label }}
              </span>
  
              <!-- Collapse arrow -->
              <i
                v-if="item.children && !collapsed"
                class="pi pi-chevron-down transition-transform"
                :class="{ 'rotate-180': isOpen(item) }"
              ></i>
            </div>
  
            <!-- Children -->
            <transition name="slide">
              <ul
                v-if="item.children && isOpen(item) && !collapsed"
                class="rtl:pr-10 ltr:pl-10 space-y-1 text-sm relative"
              >
                <li
                  v-for="c in item.children"
                  :key="c.label"
                  class="mt-2 rtl:child-item-ar ltr:child-item relative py-1"
                >
                  <router-link
                    :to="c.route!"
                    class="block px-2 py-1 rounded hover:bg-white/5"
                  >
                    {{ c.label }}
                  </router-link>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </nav>
  
      <div class="p-3 mt-10">
        <button
          class="w-full text-left p-2 rounded hover:bg-white/5 text-gray-500 flex items-center gap-3"
          @click="logout"
        >
          <VsxIcon iconName="Setting2" :size="24" type="linear" />
          <span v-if="!collapsed"> Settings</span>
        </button>
        <button
          class="w-full text-left p-2 rounded hover:bg-white/5 text-success-500 flex items-center gap-3"
          @click="logout"
        >
          <VsxIcon iconName="Headphone" :size="24" type="linear" />
          <span v-if="!collapsed"> Help</span>
        </button>
        <button
          class="w-full text-left p-2 rounded hover:bg-white/5 text-danger-500 flex items-center gap-3"
          @click="logout"
        >
          <VsxIcon iconName="LogoutCurve" :size="24" type="linear" />
          <span v-if="!collapsed"> Logout</span>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
aside {
  min-height: 100vh;
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

.child-item::before {
  content: "";
  position: absolute;
  left: -1rem;
  top: 0.75rem;
  width: 12px;
  height: 12px;
  border-left: 1px solid #c9c9c9;
  border-bottom: 1px solid #c9c9c9;
  border-radius: 0 0 0 8px;
}

.child-item-ar::before {
  content: "";
  position: absolute;
  right: -1rem;
  top: 0.75rem;
  width: 12px;
  height: 12px;
  border-right: 1px solid #c9c9c9;
  border-bottom: 1px solid #c9c9c9;
  border-radius: 0 0 0 8px;
}

.scroll-container {
  scrollbar-width: thin;
  height: calc(100vh - 4rem);
}

/* Webkit browsers (Chrome, Edge, Safari) */
.scroll-container::-webkit-scrollbar {
  width: 8px;
  transition: opacity 0.3s;
  opacity: 0;
}

.scroll-container:hover::-webkit-scrollbar,
.scroll-container:active::-webkit-scrollbar,
.scroll-container:focus::-webkit-scrollbar {
  opacity: 1; /* Show on scroll/hover */
}
</style>
