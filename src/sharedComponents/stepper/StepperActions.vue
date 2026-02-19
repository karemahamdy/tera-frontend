<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  current: number;
  total: number;
  nextText?: string;
  prevText?: string;
  finishText?: string;
}>();

const emit = defineEmits(["next", "previous", "finish"]);

const isFirst = computed(() => props.current === 0);
const isLast = computed(() => props.current === props.total - 1);
</script>

<template>
  <div class="flex justify-end gap-3 mt-8">
    <button v-if="!isFirst" @click="$emit('previous')" class="min-w-30 border border-primary-500 bg-white text-primary-500
             hover:bg-gray-50 rounded-lg px-5 py-2 flex items-center gap-2 transition">
      <VsxIcon :iconName="$i18n.locale === 'ar' ? 'ArrowRight' : 'ArrowLeft'" :size="18" />
      {{ prevText || "Previous" }}
    </button>
    <button v-if="!isLast" @click="$emit('next')" class="min-w-30 bg-primary-500 hover:bg-primary-600 text-white
             rounded-lg px-5 py-2 flex items-center gap-2 transition">
      {{ nextText || "Next" }}
      <VsxIcon :iconName="$i18n.locale === 'ar' ? 'ArrowLeft' : 'ArrowRight'" :size="18" />
    </button>
    <button v-if="isLast" @click="$emit('finish')" class="min-w-30 bg-primary-600 hover:bg-primary-700 text-white
             rounded-lg px-5 py-2 transition">
      {{ finishText || $t("button.save") }}
    </button>

  </div>
</template>
