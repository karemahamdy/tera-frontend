<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: any;
  options: any[];
  error?: string;
 placeholder?: string
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
       :placeholder="placeholder"
      @update:modelValue="$emit('update:modelValue', $event)"
    />

    <small v-if="error" class="text-danger-500">
      {{ error }}
    </small>
  </div>
</template>
