<script setup lang="ts">
import { useRouter } from "vue-router";
import Card from "primevue/card";
import Button from "primevue/button";

const router = useRouter();

const goHome = () => {
  router.push({ name: "home" }); // adjust to your home route
};

const goBack = () => {
  router.back();
};
</script>
<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[#F7F9FF] from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
  >
    <Card class="w-full max-w-lg shadow-2xl rounded-2xl">
      <template #content>
        <div class="flex flex-col items-center text-center gap-6 p-6">
          <!-- Illustration / Icon -->
          <div class="relative">
            <i class="pi pi-exclamation-triangle text-8xl"></i>
            <p class="text-xl font-bold">
              404
            </p>
          </div>
          <!-- Title -->
          <h1 class="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Page Not Found
          </h1>
          <!-- Description -->
          <p class="text-slate-600 dark:text-slate-300 max-w-sm">
            Sorry, the page you are looking for doesn’t exist or has been moved.
          </p>
          <!-- Actions -->
          <div class="flex flex-wrap gap-3 justify-center mt-4">
            <Button
              label="Go Home"
              icon="pi pi-home"
              class="rounded-xl"
              @click="goHome"
            />
            <Button
              label="Go Back"
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
              class="rounded-xl"
              @click="goBack"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* optional subtle animation */
.pi-exclamation-triangle {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>
