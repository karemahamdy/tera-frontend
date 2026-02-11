<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import Notification from "@/sharedComponents/Notification.vue";
import ChangeUserPassword from "@/sharedComponents/ChangeUserPassword.vue";
import type { Branch, ChangePassword } from "../types/user";
import { toastService } from "@/app/services/toastService";
import routesCode from '@/app/constant/routes-code.json';

import { useRouter } from "vue-router";
const router = useRouter();

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useUserStore } from "@/app/store/useUserStore";
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
  },
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

const menu = ref<any>(null);
const showDialog = ref<boolean>(false);

const toggleMenu = (event: MouseEvent) => {
  menu.value?.toggle(event);
};

const menuItems = computed(() => {
  return [
    {
      label: t("profile"),
      icon: "ProfileCircle",
      command: () => {
        console.log("Go to profile");
      },
    },
    {
      label: t("changePassword.title"),
      icon: "PasswordCheck",
      command: () => {
        showDialog.value = true;
      },
    },
    {
      separator: true,
    },
    {
      label: t("logout"),
      icon: "LogoutCurve",
      isDanger: true,
      command: () => {
        userStore.logout();
      },
    },
  ];
});

const handlePasswordChanged = async (values: ChangePassword) => {
  try {
    await userStore.changeUserPassword(values);
    toastService.success(t("changePassword.passwordChangedSuccessfully"));
  } catch (error) {
    toastService.error(error as string);
  }
};


const selectedValue = ref(null);

const treeOptions = computed(() => {
  const mapModules = (modules: any[]): any[] => {
    return modules.map((item) => ({
      key: item.code,
      label: item.name,
      data: item,
      selectable: !item.children || item.children.length === 0,
      children: item.children ? mapModules(item.children) : [],
    }));
  };

  return mapModules(userStore.modules);
});

const onSelect = async () => {
  if (selectedValue.value) {
    const code = Object.keys(selectedValue.value)[0];
    const routeCodePath = routesCode[code as keyof typeof routesCode];
    if (routeCodePath) router.push(routeCodePath);
    else router.push(`/${code}`);

    await nextTick();
    selectedValue.value = null;
  }
}

</script>
<template>
  <header class="h-16 flex items-center px-4 bg-white/80 backdrop-blur shadow">
    <div class="flex-1 flex items-center justify-between w-1/2">
      <div class="text-gray-500 flex items-center gap-2 topbar w-full">
        <TreeSelect showClear selectionMode="single" v-model="selectedValue" :options="treeOptions"
          :placeholder="$t('table.search')" @change="onSelect" filter class="w-1/2">
          <template #dropdownicon>
            <VsxIcon iconName="SearchNormal" :size="24" type="linear" />
          </template>
        </TreeSelect>
      </div>

      <div class="flex items-center gap-3 w-1/2">
        <!-- Branch Switcher -->
        <Dropdown v-if="branches.length > 0" filter v-model="selectedBranch" :options="branches"
          :optionLabel="$i18n.locale === 'ar' ? 'nameAr' : 'nameEn'" :placeholder="$t('Select Branches')"
          class="w-48" />

        <button class="p-2 text-gray-500 cursor-pointer bg-[#FAFBFB] rounded-full" @click="switchLanguage">
          <VsxIcon iconName="Translate" :size="24" type="linear" />
        </button>

        <Notification />

        <div class="flex items-center gap-2 cursor-pointer" @click="toggleMenu" aria-haspopup="true"
          aria-controls="user_menu">
          <Avatar :image="userProfile?.profileImageUrl || undefined" :label="!userProfile?.profileImageUrl
            ? userProfile?.fullName.charAt(0)
            : ''
            " shape="circle" />

          <span v-if="!collapsed" class="hidden sm:inline text-gray-500">
            <span class="font-semibold w-30 truncate">
              {{ userProfile?.fullName || "Admin" }}
            </span>
            <br />
            <small class="text-sm text-admin-muted">
              {{ userProfile?.internalID?.substring(0, 8) || "Unknown" }}
            </small>
          </span>
        </div>
        <Menu ref="menu" id="user_menu" :model="menuItems" popup>
          <template #item="{ item }">
            <div>
              <a class="p-2 flex gap-3 items-center cursor-pointer"
                @click="item.command?.({ originalEvent: $event, item })" :class="{ 'text-danger-500': item.isDanger }">
                <VsxIcon :iconName="item.icon" :size="24" type="linear" />
                {{ item.label }}
              </a>
            </div>
          </template>
        </Menu>
      </div>
    </div>
  </header>
  <template v-if="showDialog">
    <ChangeUserPassword v-model:visible="showDialog" @passwordChanged="handlePasswordChanged" />
  </template>
</template>


<style>
.topbar .p-treeselect.p-component.p-inputwrapper {
  flex-direction: row-reverse !important;
  border: unset !important;
  box-shadow: unset !important;
  background-color: var(--color-gray-50) !important;
}
</style>
