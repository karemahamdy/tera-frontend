<script setup>
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from "@/assets/images/alert.png";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSearch } from "@/composables/useSearch";

const { t } = useI18n();
const router = useRouter();
const loading = ref(false);
const showDeleteDialog = ref(false);
const rowToDelete = ref(null);

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      {
        id: 1,
        RoleName: "System Administrator",
        Description: "Full system access with all permission..",
        UserCount: "4",
        Created: "Oct 11, 2025",
      },
      {
        id: 5,
        RoleName: "Finance Manager",
        Description: "Financial operations and reporting..",
        UserCount: "1",
        Created: "Oct 11, 2025",
      },
    ],
  },
});
const customItems = [
  {
    slot: true,
    label:t("button.view"),
    icon: "Eye",
    color: "#3F5FAC",
    command: (row) => {
      router.push({ name: "RolesPermissionsView", params: { row } });
    },
  },
];
const emit = defineEmits(["search", "action-menu-click"]);

const { onSearch, filteredData } = useSearch(props.data);

const columns = computed(() => {
  const Columns = [
    {
      field: "RoleName",
      header: t("roles.roleName"),
      type: "slot",
      sortable: true,
    },
    { field: "Description", header: t("table.description"), sortable: true },
    {
      field: "UserCount",
      header: t("table.userAssigned"),
      sortable: true,
      type: "badge",
      Class: "custom-badge",
    },
    { field: "Created", header: t("table.created"), sortable: true },
    { field: "action", header: t("table.action") },
  ];

  return Columns;
});

const confirmDelete = (row) => {
  rowToDelete.value = row;
  console.log("Row to delete:", rowToDelete.value);
  showDeleteDialog.value = true;
};

const handleActionMenu = ({ action, data }) => {
  if (action === "delete") {
    confirmDelete(data);
  } else if (action === "edit") {
    const id = data.id;
    router.push({ name: "RolesPermissionsEdit", params: { id } });
  } else {
    const id = data.id;
    router.push({ name: "RolesPermissionsView", params: { id } });
  }
};

const handleDeleteConfirm = () => {
  console.log("Deleted user with ID:", rowToDelete.value);
  showDeleteDialog.value = false;
  rowToDelete.value = null;
};

const addNew = () => {
  router.push({ name: "RolesPermissionsCreate" });
};
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="accessControl" subtitle="roles.rolesPermissions" />
    <card class="bg-[#ffffff] rounded-[10px]">
      <!-- PageHeader component -->
      <template #title>
        <PageHeader
          title="roles.rolesPermissions"
          subtitle="roles.rolesInfo"
          :showExport="false"
          :showImport="false"
          :mainBtn="true"
          mainBtnText="roles.addRole"
          searchPlaceholder="roles.searchPlaceholder"
          @search="onSearch"
          :onMainBtnClick="addNew"
        />
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <DynamicTable
          :columns="columns"
          :data="filteredData"
          :loading="loading"
          :permissionItems="permissionItems"
          :customItems="customItems"
          @action-menu-click="handleActionMenu"
          :showDelete="true"
        >
        </DynamicTable>
      </template>
    </card>

    <StatusDialog
      v-model:visible="showDeleteDialog"
      :icon="alertIcon"
      :title="$t('roles.deleteRoleConfirm')"
      :buttons="[
        { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
        { label: $t('button.delete'), variant: 'danger', action: 'confirm' },
      ]"
      @confirm="handleDeleteConfirm"
    />
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
