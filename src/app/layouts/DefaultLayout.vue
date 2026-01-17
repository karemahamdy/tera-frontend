<script lang="ts" setup>
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";
import Topbar from "./Topbar.vue";
import Footer from "./Footer.vue";
import IdleTimer from "@/sharedComponents/IdleTimer.vue";
import ResetPassword from "@/sharedComponents/ResetPassword.vue";
import { useUserStore } from '@/app/store/useUserStore';
const userStore = useUserStore();
const sidebarCollapsed = ref<boolean>(
  localStorage.getItem("sidebar-collapsed") === "true"
);
function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  localStorage.setItem("sidebar-collapsed", String(sidebarCollapsed.value));
}
</script>
<template>
  <div class="layout flex">
    <IdleTimer />
    <ResetPassword v-if="userStore.requiresPasswordReset" />
    <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
    <div class="w-full">
      <Topbar @toggle="toggleSidebar" :collapsed="sidebarCollapsed" />
      <main class="main-container">
        <div class="p-6 w-full h-full bg-gray-100">
          <router-view :key="$route.fullPath" />
        </div>
        <Footer />
      </main>
    </div>
  </div>
</template>

<style>
.layout {
  height: 100vh;
  overflow: hidden;
}
.main-container {
  max-height: calc(100vh - 4rem) !important;
  overflow-y: auto;
}
</style>
