<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from "@/assets/images/alert.png";

import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSearch } from "@/composables/useSearch";
import { useFilters } from "@/composables/useFilters";
import ChangePassword from "@/sharedComponents/ChangePassword.vue";

const { t } = useI18n();
const router = useRouter();
const loading = ref(false);
const showDeleteDialog = ref(false);
const showDialog = ref(false);
const rowToDelete = ref<any>(null);

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      {
        id: 1,
        name: "John Moore",
        email: "john@tera.com",
        avatar: null,
        userGroup: "Administration",
        department: "Finance",
        accessScope: "Global",
        status: "in Active",
        lastLogin: "Oct 11, 2025",
      },
      {
        id: 2,
        name: "Mick Taylor",
        email: "mick@tera.com",
        avatar: null,
        userGroup: "Finance Team",
        department: "Finance",
        accessScope: "Branch",
        status: "Active",
        lastLogin: "Nov 3, 2025",
      },
    ],
  },
});

const permissionItems = [
  {
    label: "button.new",
    icon: "Star1",
    color: "#12B76A",
    command: (row: any) => {
      console.log("ROW", row);
      router.push(`/roles-permissions/add-user-roles/${row.id}`);
    },
  },
  {
    label: "button.view",
    icon: "Eye",
    color: "#3F5FAC",
    command: (row: any) => {
      router.push(`/roles-permissions/list-user-roles/${row.id}`);
    },
  },
];
const customItems = computed(() => {
  return [
    {
      label: t("button.resetPassword"),
      icon: "PasswordCheck",
      color: "#027A48",
      slot: true,
      action: "resetPassword",
    },
    {
      slot: true,
      changeStatus: true,
      label: t("button.active"),
      command: (row: any) => {
        console.log("toggle", row);
      },
    },
  ];
});

const filtersOperation = [
  {
    placeholder: "usersManagement.allGroups",
    value: null,
    field: "userGroup",
    options: [
      { label: "usersManagement.allGroups", value: null },
      { label: "Administration", value: "Administration" },
      { label: "Finance Team", value: "Finance Team" },
      { label: "Sales Team", value: "Sales Team" },
      { label: "HR Team", value: "HR Team" },
    ],
  },
  {
    placeholder: "usersManagement.allStatus",
    value: null,
    field: "status",
    options: [
      { label: "usersManagement.allStatus", value: null },
      { label: "active", value: "Active" },
      { label: "inactive", value: "in Active" },
    ],
  },
  {
    placeholder: "usersManagement.allScopes",
    value: null,
    field: "accessScope",
    options: [
      { label: "usersManagement.allScopes", value: null },
      { label: "Global", value: "Global" },
      { label: "Branch", value: "Branch" },
    ],
  },
  {
    placeholder: "usersManagement.allDepartment",
    value: null,
    field: "department",
    options: [
      { label: "usersManagement.allDepartment", value: null },
      { label: "Administration", value: "Administration" },
      { label: "Finance Team", value: "Finance Team" },
      { label: "Sales Team", value: "Sales Team" },
      { label: "HR Team", value: "HR Team" },
    ],
  },
];

const {
  searchQuery,
  onSearch,
  filteredData: searchedData,
} = useSearch(props.data as Record<string, any>[]);
const {
  filters,
  filteredData: filteredByFilters,
  onFilterChange,
} = useFilters(props.data, filtersOperation);

const columns = computed(() => {
  const Columns = [
    {
      field: "user",
      header: t("usersManagement.user"),
      type: "avatar",
      sortable: true,
    },
    {
      field: "userGroup",
      header: t("userGroup.userGroup"),
      sortable: true,
      type: "tag",
      Class: "custom-tag",
    },
    {
      field: "department",
      header: t("usersManagement.department"),
      sortable: true,
    },
    { field: "accessScope", header: t("roles.accessScope"), sortable: true },
    { field: "status", header: t("status"), sortable: true },
    {
      field: "lastLogin",
      header: t("usersManagement.lastLogin"),
      sortable: true,
    },
    { field: "permission", header: t("permission") },
    { field: "action", header: t("action") },
  ];

  return Columns;
});

const tableData = computed(() => {
  if (searchQuery.value) {
    return searchedData.value;
  }

  const hasActiveFilter = filters.value.some((f) => f.value !== null);
  if (hasActiveFilter) {
    return filteredByFilters.value;
  }
  return props.data;
});

const confirmDelete = (row: any) => {
  rowToDelete.value = row;
  showDeleteDialog.value = true;
};

const showResetDialog = (row: any) => {
  rowToDelete.value = row;
  showDialog.value = true;
};

const handleActionMenu = ({ action, data }: any) => {
  if (action === "delete") confirmDelete(data);
  if (action === "resetPassword") showResetDialog(data);
};

const handleDeleteConfirm = () => {
  showDeleteDialog.value = false;
  rowToDelete.value = null;
};

const addUserGroup = () => {
  router.push("/user-management/create");
};
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader
      title="accessControl"
      subtitle="usersManagement.usersManagement"
    />
    <card class="bg-[#ffffff] rounded-[10px]">
      <!-- PageHeader component -->
      <template #title>
        <PageHeader
          title="usersManagement.usersManagement"
          subtitle="usersManagement.usersManagementDesc"
          :showExport="true"
          :showImport="true"
          :mainBtn="true"
          mainBtnText="usersManagement.addUser"
          searchPlaceholder="usersManagement.searchPlaceholder"
          @search="onSearch"
          :showFilter="true"
          @filter-change="onFilterChange"
          :filters="filters"
          :onMainBtnClick="addUserGroup"
        />
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <DynamicTable
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :permissionItems="permissionItems"
          :customItems="customItems"
          :showDelete="true"
          @action-menu-click="handleActionMenu"
        >
          <!-- @vue-ignore -->
          <template #menu-item="{ item, row }">
            <div
              v-if="item.changeStatus"
              class="flex items-center gap-2 px-3 py-2"
            >
              <ToggleSwitch v-model="row.status" />
              <span>{{ item.label }}</span>
            </div>
          </template>
        </DynamicTable>
      </template>
    </card>

    <StatusDialog
      v-model:visible="showDeleteDialog"
      :icon="alertIcon"
      :title="$t('usersManagement.deleteRoleConfirm')"
      :buttons="[
        { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
        { label: $t('button.delete'), variant: 'danger', action: 'confirm' },
      ]"
      @confirm="handleDeleteConfirm"
    />
    <ChangePassword v-model:visible="showDialog" />
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 16px;
  color: var(--color-gray-500);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #faf9f9;
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: 13px;
  padding: 20px 16px;
}
</style>
