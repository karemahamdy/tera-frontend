<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string;
  modelValue: any;
  options: any[];
  error?: string;
  optionValue?: string;
  placeholder?: string;
}>(), {
  optionValue: 'value',
  placeholder: ''
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <label class="block mb-1 font-medium"><strong>{{ label }}</strong></label>

    <Dropdown
      class="w-full n"
      filter
      optionLabel="label"
      :optionValue="props.optionValue"
      :options="props.options"
      :modelValue="props.modelValue"
      :placeholder="props.placeholder"
      @update:modelValue="(v: any) => emit('update:modelValue', v)"
    />

    <small v-if="error" class="text-danger-500">
      {{ error }}
    </small>
  </div>
</template>
