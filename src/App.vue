<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount } from "vue";
import Loading from "./sharedComponents/Loading.vue";
import { useLoadingStore } from "@/app/store/useLoadingStore";
const loadingStore = useLoadingStore();
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { toastService } from "./app/services/toastService";
import { useUserStore } from "@/app/store/useUserStore";

const toast = useToast();
const { locale } = useI18n();

onMounted(() => {
  toastService.init(toast);
});

let isReload = false;

onMounted(() => {
  const userStore = useUserStore();

  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

  if (nav?.type === "reload") {
    isReload = true;
  }

  // Detect visibility change
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      // If not a reload, user is closing the tab/browser
      if (!isReload) {
        userStore.closeSession();
      }
    }
  });
});

onBeforeUnmount(() => {
  const userStore = useUserStore();
  window.removeEventListener("beforeunload", userStore.closeSession);
});

// Watch for changes in the language
watch(
  locale,
  (newLang) => {
    if (newLang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  },
  { immediate: true }
);
</script>

<template>
  <main class="bg-[#FFFFFF]">
    <Toast />
    <Loading v-if="loadingStore.loading" />
    <RouterView />
  </main>
</template>
