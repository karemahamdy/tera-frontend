<script setup lang="ts"></script>
<template>
  <div>
    <div>
      <p class="font-bold mb-5 mt-10 text-lg">
        {{ $t("items.attachmentsGallery") }}
      </p>
      <div
        class="p-5 w-full border border-dashed bg-primary-50 border-primary-500 rounded-xl flex flex-col justify-center items-center gap-3 cursor-pointer"
      >
        <VsxIcon
          class="text-primary-500"
          iconName="ExportCurve"
          :size="32"
          type="linear"
        />
        <p class="text-lg text-gray-700">{{ $t("items.dragAndDrop") }}</p>
        <p class="text-gray-500 text-sm">{{ $t("items.supportedFormats") }}</p>
      </div>
    </div>
    <div>
      <p class="my-5 text-lg">
        {{ $t("items.uploadedFiles") }}
      </p>
      <div
        class="p-10 w-full border bg-gray-100 border-gray-300 rounded-xl flex justify-center items-center gap-3 cursor-pointer"
      >
        <p class="text-lg text-gray-700">{{ $t("items.noFilesUploaded") }}</p>
      </div>
    </div>
  </div>
</template>
