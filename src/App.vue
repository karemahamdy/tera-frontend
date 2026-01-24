<script setup lang="ts">
import { onMounted, watch } from "vue";
import Loading from "./sharedComponents/Loading.vue";
import { useLoadingStore } from "@/app/store/useLoadingStore";
const loadingStore = useLoadingStore();
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { toastService } from "./app/services/toastService";

const toast = useToast();
const { locale } = useI18n();

onMounted(() => {
  toastService.init(toast);
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
