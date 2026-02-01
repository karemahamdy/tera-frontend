<script setup lang="ts">
defineProps<{
  activeIndex: number;
}>();
</script>

<template>
  <div class="flex justify-end mt-10 gap-2">
    <a v-if="activeIndex > 0"
      @click="$emit('previous')"
      class="w-1/6 border border-primary-500 bg-white hover:bg-gray-100 cursor-pointer text-primary-500 py-2 rounded flex items-center justify-center gap-2 px-10"
    >
      <VsxIcon
        :iconName="$i18n.locale === 'ar' ? 'ArrowRight' : 'ArrowLeft'"
        :size="24"
        type="linear"
      />
      {{ $t("items.previous") }}
    </a>
    <template>

    </template>
    <a
      v-if="activeIndex < 5"
      @click="$emit('next')"
      class="w-1/6 bg-primary-500 hover:bg-primary-700 cursor-pointer text-white py-2 rounded flex items-center justify-center gap-2 px-10"
    >
      {{ $t("items.next") }}
      <VsxIcon
        :iconName="$i18n.locale === 'ar' ? 'ArrowLeft' : 'ArrowRight'"
        :size="24"
        type="linear"
      />
    </a>
    <button
      v-if="activeIndex === 5"
      class="w-1/6 bg-primary-500 hover:bg-primary-700 cursor-pointer text-white py-2 rounded flex items-center justify-center gap-2 px-10"
    >
      {{ $t("items.createItem") }}
    </button>
  </div>
</template>
