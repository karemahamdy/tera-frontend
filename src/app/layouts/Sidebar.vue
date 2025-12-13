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
  {
    label: "Acces Control",
    icon: "SecurityUser",
    children: [
      { label: "Users Management", route: "/user-management" },
      { label: "User Groups", route: "/user-group" },
      { label: "Branch Management", route: "/roles" },
      { label: "Roles Management", route: "/roles" },
      { label: "Active Sessions", route: "/roles" },
      { label: "Security Settings", route: "/roles" },
      { label: "Audit Log", route: "/" },
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
  router.push("/auth/login");
}
</script>

<template>
  <aside
    :class="[
      'sidebar-bg text-white transition-all duration-200',
      collapsed ? 'w-16' : 'w-72',
    ]"
  >
    <div class="h-16 flex items-center px-5 border-b border-gray-200">
      <div class="flex items-center gap-5 w-full">
        <img :src="logo" alt="Logo" width="48" height="48" />
        <div v-if="!collapsed" class="text-lg text-primary-500">TERA ERP</div>
      </div>
    </div>
    <div class="scroll-container overflow-y-auto overflow-x-hidden">
      <!-- user panel -->
      <div class="px-3 py-4 flex items-center gap-3">
        <div v-if="!collapsed" class="text-gray-500">Quick Access</div>
      </div>

      <!-- nav -->
      <nav class="p-2 text-gray-500">
        <ul>
          <li class="mb-1">
            <router-link
              class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 cursor-pointer"
              to="/"
              :activeClass="$i18n.locale === 'ar' ? 'active active-link-ar' : 'active active-link'"
            >
              <VsxIcon iconName="Element4" :size="24" type="linear" />
              {{ $t("Dashboard") }}
            </router-link>
          </li>
          <li v-for="item in navItems" :key="item.label" class="mb-1">
            <!-- Parent item -->
            <div
              class="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 cursor-pointer"
              :class="{
                active: isOpen(item),
                'active-link': isOpen(item) && $i18n.locale !== 'ar',
                'active-link-ar': isOpen(item) && $i18n.locale === 'ar',
              }"
              @click="item.children ? toggle(item) : router.push(item.route!)"
            >
              <VsxIcon :iconName="item.icon" :size="24" type="linear" />

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
                class="space-y-1 text-sm relative border-[#767B76] mt-2 text-gray-400"
                :class="
                  $i18n.locale === 'ar'
                    ? 'pr-10 parent-ul-ar'
                    : 'pl-10 parent-ul'
                "
              >
                <li
                  v-for="c in item.children"
                  :key="c.label"
                  class="mt-2 relative py-1"
                  :class="
                    $i18n.locale === 'ar' ? 'child-item-ar' : 'child-item'
                  "
                >
                  <router-link
                    :to="c.route!"
                    class="block px-2 py-1 rounded-lg"
                    activeClass="bg-primary-25"
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
        >
          <VsxIcon iconName="Setting2" :size="24" type="linear" />
          <span v-if="!collapsed"> Settings</span>
        </button>
        <button
          class="w-full text-left p-2 rounded hover:bg-white/5 text-success-500 flex items-center gap-3"
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

<style scoped lang="scss">
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
  top: 0;
  left: 1.5rem;
  width: 1px;
  height: calc(100% - 1.5rem);
  background-color: var(--color-gray-400);
}

.parent-ul-ar::before {
  content: "";
  position: absolute;
  top: 0;
  right: 1.5rem;
  width: 1px;
  height: calc(100% - 1.5rem);
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
</style>
