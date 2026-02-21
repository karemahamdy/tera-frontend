<script setup lang="ts">
defineProps<{
  label: string;
  modelValue: string | Date;
  type?: string;
  invalid?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label class="block mb-1 font-medium"
      ><strong>{{ label }}</strong></label
    >
    <InputText
      :type="type ?? 'text'"
      v-if="type != 'date'"
      class="w-full p-3 border rounded-lg bg-gray-50 border-gray-300"
      :invalid="!!invalid"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:modelValue="$emit('update:modelValue', $event)"
      :modelValue="modelValue as string"
    />

    <DatePicker
      v-else
      showIcon
      fluid
      iconDisplay="input"
      :invalid="!!invalid"
      :placeholder="placeholder"
      :disabled="disabled"
      @update:modelValue="$emit('update:modelValue', $event)"
      :modelValue="modelValue as Date"
    />

    <small v-if="error" class="text-danger-500">
      {{ $t(error) }}
    </small>
  </div>
</template>
<style scoped>
::v-deep(.p-inputtext) {
  background-color: var(--color-gray-50);
  border-color: var(--color-gray-300);
  padding: 0.75rem;
  border-radius: 0.5rem;
}
</style>
