<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: string;
  type?: string;
  error?: string;
   placeholder?: string;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label class="block mb-1 font-medium">{{ label }}</label>

    <InputText
      :type="type ?? 'text'"
      class="w-full p-3 border rounded-lg bg-gray-50"
      :class="error ? 'border-red-500' : 'border-gray-300'"
      :modelValue="modelValue"
       :placeholder="placeholder"
      @update:modelValue="$emit('update:modelValue', $event)"
    />

    <small v-if="error" class="text-red-500">
      {{ error }}
    </small>
  </div>
</template>
