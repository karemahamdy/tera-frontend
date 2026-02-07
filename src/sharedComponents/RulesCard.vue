<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

type ColorVariant = "warning" | "success" | "primary" | "danger" | "neutral";

interface Props {
  title: string;
  items: string[]; 
  color?: ColorVariant;
}

const props = withDefaults(defineProps<Props>(), {
  color: "warning",
});

const variants: Record<ColorVariant, string> = {
  warning: "bg-warning-50 border-warning-300 text-gray-700",
  success: "bg-success-50 border-success-300 text-gray-700",
  primary: "bg-primary-50 border-primary-300 text-gray-700",
  danger: "bg-danger-50 border-danger-300 text-gray-700",
  neutral: "bg-gray-50 border-gray-300 text-gray-700",
};

const variantClass = computed(() => variants[props.color]);

const { t } = useI18n();
</script>

<template>
  <div class="rounded-xl border p-4 shadow-sm mt-2" :class="variantClass">
    <h3 class="font-semibold mb-2">{{ t(title) }}</h3>

    <ul class="list-disc ps-5 space-y-1 text-sm">
      <li v-for="(item, i) in items" :key="i">{{ t(item) }}</li>
    </ul>
  </div>
</template>
