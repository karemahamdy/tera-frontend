<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
  modelValue: File | null;
  maxSizeMb?: number;
  accept?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  maxSizeMb: 5,
  accept: () => ["image/png", "image/jpeg", "image/webp"],
});

const emit = defineEmits<{
  (e: "update:modelValue", file: File | null): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const dragActive = ref(false);
const previewUrl = ref<string | null>(null);
const error = ref<string | null>(null);

const acceptAttr = computed(() => props.accept.join(","));

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const reset = () => {
  emit("update:modelValue", null);
  previewUrl.value = null;
  error.value = null;
};

const validateFile = (file: File): boolean => {
  if (!props.accept.includes(file.type)) {
    error.value = "Invalid file type";
    return false;
  }

  if (file.size > props.maxSizeMb * 1024 * 1024) {
    error.value = `Max size is ${props.maxSizeMb}MB`;
    return false;
  }

  error.value = null;
  return true;
};

const createPreview = (file: File) => {
  if (!file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewUrl.value = reader.result as string;
  };
  reader.readAsDataURL(file);
};

const handleFile = (file: File) => {
  if (!validateFile(file)) return;

  emit("update:modelValue", file);
  createPreview(file);
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) handleFile(input.files[0]);
};

const handleDrop = (e: DragEvent) => {
  dragActive.value = false;
  if (e.dataTransfer?.files?.[0]) handleFile(e.dataTransfer.files[0]);
};

const setSelectedImage = (url: string) => {
  previewUrl.value = url;
};

watch(
  () => props.modelValue,
  (file) => {
    if (!file) reset();
  }
);

defineExpose({
  setSelectedImage,
});
</script>

<template>
  <div class="bg-white flex items-start justify-start">
    <div class="w-full max-w-2xl">
      <div class="flex items-start gap-6">
        <!-- Upload Box -->
        <div
          :class="[
            'relative w-48 h-48 rounded-3xl flex items-center justify-center cursor-pointer transition',
            dragActive ? 'bg-gray-200' : 'bg-gray-100',
          ]"
          @click="triggerFileInput"
          @dragenter.prevent="dragActive = true"
          @dragover.prevent="dragActive = true"
          @dragleave.prevent="dragActive = false"
          @drop.prevent="handleDrop"
        >
          <input
            ref="fileInputRef"
            type="file"
            class="hidden"
            :accept="acceptAttr"
            @change="handleFileChange"
          />
    
          <!-- Preview -->
          <img
            v-if="previewUrl"
            :src="previewUrl"
            class="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />
    
          <!-- Placeholder -->
          <div v-else class="relative">
            <!-- Image Icon -->
            <div class="w-20 h-20 flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect
                  x="8"
                  y="12"
                  width="48"
                  height="40"
                  rx="6"
                  stroke="#9CA3AF"
                  stroke-width="2.5"
                  fill="none"
                />
                <circle
                  cx="22"
                  cy="26"
                  r="5"
                  stroke="#9CA3AF"
                  stroke-width="2.5"
                  fill="none"
                />
                <path
                  d="M12 42 L24 30 L32 38 L42 28 L52 38 L52 46 C52 48.2 50.2 50 48 50 L16 50 C13.8 50 12 48.2 12 46 Z"
                  fill="#E5E7EB"
                  stroke="#9CA3AF"
                  stroke-width="2"
                />
              </svg>
            </div>
    
            <!-- Plus Icon Badge -->
            <div
              class="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-gray-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="#4B5563"
                stroke-width="2.5"
              >
                <line x1="8" y1="3" x2="8" y2="13" />
                <line x1="3" y1="8" x2="13" y2="8" />
              </svg>
            </div>
          </div>
        </div>
        <!-- Info -->
        <div class="flex-1 pt-4">
          <div class="flex items-center gap-3 mb-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              stroke-width="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <h3 class="text-xl font-medium text-gray-900">
              {{ $t("usersManagement.uploadImage") }}
            </h3>
          </div>
    
          <div class="relative">
            <p class="text-gray-400 text-base leading-relaxed">
              {{ $t("usersManagement.uploadImageDesc") }}
            </p>
    
            <!-- Red Dot -->
            <div
              class="absolute -right-8 top-2 w-2 h-2 bg-red-500 rounded-full"
            ></div>
          </div>
    
          <div
            v-if="modelValue"
            class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <p class="text-sm text-green-700">Selected: {{ modelValue.name }}</p>
          </div>
          <p v-if="error" class="mt-2 text-red-500 text-sm">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
