<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

// Watch for changes in the language
watch(locale, (newLang) => {
  if (newLang === 'ar') {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
}, { immediate: true });
</script>

<template>
  <main class="bg-[#FFFFFF]">
    <RouterView />
  </main>
</template>