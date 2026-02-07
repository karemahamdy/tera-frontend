<script setup lang="ts">
import { ref } from "vue";
import { useItems } from "../composables/useItems";
const { files } = useItems();

const fileInput = ref<HTMLInputElement | null>(null);

const openFileDialog = () => {
  fileInput.value?.click();
};

const handleFiles = (newFiles: FileList | null) => {
  if (!newFiles) return;

  files.value.push(...Array.from(newFiles));
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  handleFiles(target.files);
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  handleFiles(event.dataTransfer?.files || null);
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const getFileUrl = (file: File) => URL.createObjectURL(file);

const openFile = (file: File) => {
  const url = getFileUrl(file);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const isImage = (file: File) => file.type.startsWith("image/");
const isPdf = (file: File) => file.type === "application/pdf";
</script>

<template>
  <div>
    <!-- Upload area -->
    <p class="font-bold mb-5 mt-10 text-lg">
      {{ $t("items.attachmentsGallery") }}
    </p>

    <div
      class="p-5 w-full border border-dashed bg-primary-50 border-primary-500 rounded-xl flex flex-col justify-center items-center gap-3 cursor-pointer"
      @click="openFileDialog"
      @drop="onDrop"
      @dragover="onDragOver"
    >
      <VsxIcon
        class="text-primary-500"
        iconName="ExportCurve"
        :size="32"
        type="linear"
      />
      <p class="text-lg text-gray-700">{{ $t("items.dragAndDrop") }}</p>
      <p class="text-gray-500 text-sm">{{ $t("items.supportedFormats") }}</p>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        multiple
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <!-- Uploaded files -->
    <p class="my-5 text-lg">
      {{ $t("items.uploadedFiles") }}
    </p>

    <div
      v-if="files.length"
      class="p-5 w-full space-y-3 grid grid-cols-4 gap-4 flex-wrap"
    >
      <div
        v-for="(file, index) in files"
        :key="index"
        class="border bg-gray-100 border-gray-300 rounded-xl p-3 h-full cursor-pointer hover:bg-gray-200"
        @click="openFile(file)"
      >
        <!-- PREVIEW -->
        <div
          class="mb-3 h-32 flex items-center justify-center overflow-hidden rounded-lg bg-white"
        >
          <!-- Image preview -->
          <img
            v-if="isImage(file)"
            :src="getFileUrl(file)"
            class="h-full object-contain"
          />

          <!-- PDF first page preview -->
          <embed
            v-else-if="isPdf(file)"
            :src="getFileUrl(file) + '#page=1'"
            type="application/pdf"
            class="h-full w-full"
          />

          <!-- Fallback -->
          <VsxIcon
            v-else
            iconName="Document"
            :size="40"
            type="linear"
            class="text-gray-400"
          />
        </div>

        <!-- FILE INFO -->
        <p class="font-medium truncate text-center" :title="file.name">
          {{ file.name }}
        </p>

        <p class="text-sm text-gray-500 text-center">
          {{ (file.size / 1024).toFixed(2) }} KB
        </p>

        <!-- REMOVE -->
        <div class="flex justify-center mt-4">
          <button
            class="px-5 cursor-pointer flex gap-1 items-center py-1 rounded-xl bg-danger-500 hover:bg-danger-700 text-white"
            @click.stop="files.splice(index, 1)"
          >
            <VsxIcon iconName="Trash" :size="16" type="linear" />
            {{ $t("button.remove") }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="p-10 w-full border bg-gray-100 border-gray-300 rounded-xl flex justify-center"
    >
      <p class="text-lg text-gray-700">
        {{ $t("items.noFilesUploaded") }}
      </p>
    </div>
  </div>
</template>
