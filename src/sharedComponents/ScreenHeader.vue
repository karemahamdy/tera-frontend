
<template>
  <div class="heading-section mb-6">
    <div class="flex items-center gap-3">
      <i class="pi pi-send" style="color: green"></i>
      <p class="heading-title">{{ title }}</p>
      <i class="pi pi-arrow-right" style="color: green"></i>
      <span class="screen-header-name">{{ subtitle }}</span>
    </div>
    </div>
  </template>

  <script setup>
  import { defineProps } from "vue";  
  const props = defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: "" }
  });
  </script>