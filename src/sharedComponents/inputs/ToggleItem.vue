<script setup lang="ts">
defineProps<{
  title: string;
  label: string;
  modelValue: boolean;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <p class="mb-2 font-medium">{{ title }}</p>

    <div class="flex items-center gap-3">
      <ToggleSwitch
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
      />
      <span>{{ label }}</span>
    </div>
  </div>
</template>
