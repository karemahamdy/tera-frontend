<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from '@/app/store/useUserStore';
import Notification from "@/sharedComponents/Notification.vue";
import type { Branch } from "../types/user";

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

// Computed properties for User Profile & Branches
const branches = computed(() => {
  return userStore.userProfile?.branches?.available || [];
});

const selectedBranch = computed({
  get: () => userStore.userProfile?.branches?.current,
  set: (value: Branch | undefined) => {
    if (value && userStore.userProfile?.branches) {
        userStore.switchBranch(value.id);
    }
  }
});

const userProfile = computed(() => userStore.userProfile?.profile);

// Change language via store so it persists and updates document attributes
function switchLanguage() {
  userStore.toggleLang();
}

onMounted(async () => {
    if (!userStore.userProfile) {
        await userStore.fetchUserProfile();
    }
});
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
        <!-- Branch Switcher -->
        <Dropdown 
            v-if="branches.length > 0"
            filter 
            v-model="selectedBranch" 
            :options="branches" 
            :optionLabel="$i18n.locale === 'ar' ? 'nameAr' : 'nameEn'" 
            :placeholder="$t('Select Branches')"
            class="w-48" 
        />

        <button class="p-2 text-gray-500 cursor-pointer bg-[#FAFBFB] rounded-full" @click="switchLanguage">
          <VsxIcon iconName="Translate" :size="24" type="linear" />
        </button>

        <!-- <button class="p-2 text-gray-500 cursor-pointer bg-[#FAFBFB] rounded-full relative">
          <VsxIcon iconName="Notification" :size="24" type="linear" />
          <span v-if="hasNotification" class="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FC9D0F] rounded-full"></span>
        </button> -->
        <Notification/>

        <div class="flex items-center gap-2">
          <Avatar :image="userProfile?.profileImageUrl || 'https://i.pravatar.cc/40'" shape="circle" />
          <span v-if="!collapsed" class="hidden sm:inline text-gray-500">
            <span class="font-semibold">{{ userProfile?.fullName || 'Admin' }}</span>
            <br />
            <!-- Using internalID or similar as a subtitle/ID if desired -->
            <small class="text-sm text-admin-muted">{{ userProfile?.internalID?.substring(0, 8) || 'Unknown' }}</small>
          </span>
        </div>
      </div>
    </div>
  </header>
</template>
