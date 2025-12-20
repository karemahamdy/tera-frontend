<script setup lang="ts">
// import { onMounted } from "vue";
// import axiosWrapper from '@/app/http/axiosWrapper';

// onMounted(async () => {
//   await axiosWrapper.get<any>("/test",);
// });
</script>
<template>
  <div class="flex items-center justify-center h-[70vh]">
    <Card class="w-full max-w-lg text-center">
      <template #content>
        <i class="pi pi-home text-4xl text-gray-300 mb-3"></i>

        <h2 class="text-xl font-semibold text-gray-800">Home</h2>

        <p class="text-gray-500 mt-2">
          Choose a section from the sidebar to begin.
        </p>
      </template>
    </Card>
  </div>
</template>
<style scoped></style>
