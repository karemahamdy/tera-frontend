<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string;
  modelValue: any;
  options: any[];
  error?: string;
  invalid?: boolean;
  optionValue?: string;
  placeholder?: string;
  disabled?: boolean;
}>(), {
  optionValue: 'value',
  placeholder: '',
    disabled: false
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
      :invalid="!!props.invalid"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      @update:modelValue="(v: any) => emit('update:modelValue', v)"
    />

    <small v-if="error" class="text-danger-500">
      {{ $t(error) }}
    </small>
  </div>
</template>
