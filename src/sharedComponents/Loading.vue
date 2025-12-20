<script setup lang="ts">
defineProps<{
  text?: string;
}>();
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur"
    >
      <ProgressSpinner
        strokeWidth="4"
        animationDuration="1.2s"
        class="w-12 h-12"
      />
      <p v-if="text" class="text-sm text-gray-500">
        {{ text }}
      </p>
    </div>
  </Teleport>
</template>
