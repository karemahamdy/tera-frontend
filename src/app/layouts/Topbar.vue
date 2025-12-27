<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from '@/app/store/useUserStore';
const userStore = useUserStore();

// Props
defineProps<{
  collapsed: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "toggle"): void;
}>();

// State
const q = ref("");

const options = [
  { label: "Option 1", value: 1 },
  { label: "Option 2", value: 2 },
  { label: "Option 3", value: 3 },
];
const selectedOption = ref<number | null>(null);
// Change language via store so it persists and updates document attributes
function switchLanguage() {
  userStore.toggleLang();
}
</script>
<template>
  <header class="h-16 flex items-center px-4 bg-white/80 backdrop-blur shadow">
    <!-- <button class="p-2 mr-3" @click="$emit('toggle')">
      <i class="pi pi-bars"></i>
    </button> -->

    <div class="flex-1 flex items-center justify-between w-full">
      <div class="text-gray-500 flex items-center gap-2">
        <VsxIcon iconName="SearchNormal" :size="24" type="linear" />
        <input v-model="q" :placeholder="$t('table.search')" class="p-2 rounded w-64" />
      </div>

      <div class="flex items-center gap-3">
        <Dropdown
            v-model="selectedOption"
            :options="options"
            optionLabel="label"
            :placeholder="$t('Select Branches')"
            class="w-48"
          />

        <button class="p-2 text-gray-500 cursor-pointer" @click="switchLanguage">
          <VsxIcon iconName="Translate" :size="24" type="linear" />
        </button>

        <div class="flex items-center gap-2">
          <Avatar image="https://i.pravatar.cc/40" shape="circle" />
          <span v-if="!collapsed" class="hidden sm:inline text-gray-500">
            <span class="font-semibold">Admin</span>
            <br />
            <small class="text-sm text-admin-muted">121.242</small>
          </span>
        </div>
      </div>
    </div>
  </header>
</template>
