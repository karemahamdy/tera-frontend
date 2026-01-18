<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { NavItem } from "@/app/types/navigation";

const props = defineProps<{
  item: NavItem;
  collapsed: boolean;
  level?: number;
  activeClass: string;
  parentActiveClass?: string;
}>();

const router = useRouter();
const route = useRoute();

const open = ref(false);

function toggle() {
  if (props.item.children) {
    open.value = !open.value;
  }
}

function navigate() {
  if (props.item.route) {
    router.push(props.item.route);
  }
}

const isActive = computed(() => {
  return props.item.route === route.path;
});
</script>

<template>
  <li
    class="relative my-2"
    :class="
      level ? ($i18n.locale === 'ar' ? 'child-item-ar' : 'child-item') : ''
    "
  >
    <!-- ITEM -->
    <div
      class="flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition"
      :class="[(isActive || open) && !parentActiveClass && activeClass, item.children && parentActiveClass]"
      @click="item.children ? toggle() : navigate()"
    >
      <VsxIcon
        v-if="item.icon"
        :iconName="item.icon"
        :size="20"
        type="linear"
      />

      <span v-if="!collapsed" class="flex-1 w-30 truncate">
        {{ item.label }}
      </span>

      <i
        v-if="item.children && !collapsed"
        class="pi pi-chevron-down transition-transform"
        :class="{ 'rotate-180': open }"
      />
    </div>

    <!-- CHILDREN (RECURSIVE) -->
    <transition name="slide">
      <ul
        v-if="item.children && open && !collapsed"
        class="mt-1 space-y-1"
        :class="$i18n.locale === 'ar' ? 'parent-ul-ar pr-6' : 'parent-ul pl-6'"
      >
        <SidebarItem
          v-for="child in item.children"
          :key="child.label"
          :item="child"
          :collapsed="collapsed"
          :level="(level || 0) + 1"
          activeClass="active-li"
          parentActiveClass="bg-primary-500 text-white"
        />
      </ul>
    </transition>
  </li>
</template>
