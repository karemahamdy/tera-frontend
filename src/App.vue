<script setup lang="ts">
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import Loading from "./sharedComponents/Loading.vue";
import { useLoadingStore } from "@/app/store/useLoadingStore";
const loadingStore = useLoadingStore();

const { locale } = useI18n();

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
