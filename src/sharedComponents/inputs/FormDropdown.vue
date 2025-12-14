<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: any;
  options: any[];
  error?: string;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label class="block mb-1 font-medium">{{ label }}</label>

    <Dropdown
      class="w-full n"
      optionLabel="label"
      :options="options"
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
    />

    <small v-if="error" class="text-red-500">
      {{ error }}
    </small>
  </div>
</template>
