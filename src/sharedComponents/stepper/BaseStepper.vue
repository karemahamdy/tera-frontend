<script setup lang="ts">
import { computed } from "vue";
// import VsxIcon from "vue-iconsax";

/* ================= Types ================= */
interface StepItem {
  label: string;
}

interface Props {
  steps: StepItem[];
  modelValue?: number;
  code?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

/* ================= State ================= */
const current = computed(() => props.modelValue ?? 0);

/* progress to center of active circle */
const progressWidth = computed(() => {
  const count = props.steps.length;
  if (count <= 1) return "0%";

  // if we're on the last step, fill the whole bar
  if (current.value >= count - 1) return "100%";

  return `${((current.value + 0.5) / count) * 100}%`;
});

/* detect RTL and build progress style accordingly */
const isRtl = computed(() => {
  if (typeof document === "undefined") return false;
  const dir =
    document.documentElement.getAttribute("dir") ||
    (document as any).dir ||
    getComputedStyle(document.documentElement).direction;
  return dir === "rtl";
});

const progressStyle = computed(() => {
  return {
    width: progressWidth.value,
    ...(isRtl.value ? { right: "0" } : { left: "0" }),
  } as Record<string, string>;
});

/* ================= Actions ================= */
const goTo = (i: number) => {
  emit("update:modelValue", i);
};
</script>

<template>
  <div class="w-full">
    <!-- ================= Header / Stepper Card ================= -->
    <div class="bg-white rounded-2xl border border-gray-200 px-6 py-5 mb-6">
      <!-- header -->
      <div class="flex items-center gap-3 mb-6">
        <span class="text-primary-600 font-semibold text-sm">
          {{ $t("button.step", { index: current + 1, total: steps.length } ) }}
        </span>

        <span v-if="code" class="px-3 py-1 rounded-lg text-xs font-medium
                 bg-primary-50 text-primary-600">
          {{ code }}
        </span>
      </div>

      <!-- ================= Stepper ================= -->
      <div class="relative flex items-start justify-between">
        <!-- base line -->
        <div class="absolute top-2 left-0 w-full h-3 bg-gray-200 rounded-full" />

        <!-- progress -->
        <div class="absolute top-2 h-3 bg-[#A2B3DD] rounded-full transition-all duration-300"
          :style="progressStyle" />

        <!-- steps -->
        <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center flex-1 cursor-pointer"
          @click="goTo(index)">
          <!-- circle -->
          <div class="z-10 w-8 h-8 flex items-center justify-center rounded-full border transition shadow-md" :class="index <= current
            ? 'bg-[#638EFF] border-[#638EFF]'
            : 'bg-white border-[#97afeb]'">
            <VsxIcon iconName="Send2" :size="20" type="linear"
              :class="index <= current ? 'text-white' : 'text-gray-400'" />
          </div>

          <!-- label -->
          <span class="mt-3 text-sm font-medium whitespace-nowrap text-center"
            :class="index === current ? 'text-[#638EFF]' : 'text-gray-500'">
            {{ index + 1 }}. {{ step.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- ================= Step Content (Wizard) ================= -->
    <div class="w-full">
      <!-- ✅ clean slot -->
      <slot :current="current" />
    </div>
  </div>
</template>
