<script setup>
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from "@/assets/images/alert.png";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useRoles } from "../composables/useRoles";

const {
  list,
  loading,
  pagination,
  getList,
  changePage,
  search,
  sort,
  deleteItem,
} = useRoles();

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref(null);

const customItems = computed(() => {
  return [
    {
      slot: true,
      label: t("button.view"),
      icon: "Eye",
      color: "#3F5FAC",
      command: (row) => {
        router.push({ name: "RolesPermissionsView", params: { row } });
      },
    },
  ];
});
const emit = defineEmits(["search", "action-menu-click"]);


const columns = computed(() => {
  const Columns = [
    {
      field: "name",
      header: t("roles.roleName"),
      type: "slot",
      sortable: true,
    },
    { field: "discription", header: t("table.description"), sortable: true },
    {
      field: "userAssigned",
      header: t("table.userAssigned"),
      sortable: true,
      type: "badge",
      Class: "custom-badge",
    },
    {
      field: "createAt",
      header: t("table.created"),
      sortable: true,
      type: "date",
    },
    { field: "action", header: t("table.action") },
  ];

  return Columns;
});

const firstRecord = computed(() => {
  return list.value.length === 0
    ? 0
    : (pagination.value["PagenationDto.PageIndex"] - 1) *
        pagination.value["PagenationDto.PageSize"] +
        1;
});

const lastRecord = computed(() => {
  if (list.value.length === 0) return 0;
  const last = firstRecord.value + list.value.length - 1;
  return last > pagination.value.total ? pagination.value.total : last;
});

const confirmDelete = (row) => {
  rowToDelete.value = row;
  showDeleteDialog.value = true;
};

const handleActionMenu = async (payload) => {
  const action = payload.action || payload;
  const data = payload.data || payload.row || payload;
  if (action === "delete") {
    if (data && data.id) {
      confirmDelete(data);
    }
  } else if (action === "edit") {
    if (data && data.id) {
      const id = data.id;
      router.push({ name: "RolesPermissionsEdit", params: { id } });
    }
  } else {
    const id = data.id;
    router.push({ name: "RolesPermissionsView", params: { id } });
  }
};

const handleDeleteConfirm = async () => {
  showDeleteDialog.value = false;
  await deleteItem(rowToDelete.value.id);
  rowToDelete.value = null;
};

const addNew = () => {
  router.push({ name: "RolesPermissionsCreate" });
};

onMounted(() => {
  getList();
});
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
          @search="search"
          :onMainBtnClick="addNew"
        />
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <DynamicTable
          :columns="columns"
          :data="list"
          :loading="loading"
          :permissionItems="permissionItems"
          :customItems="customItems"
          @action-menu-click="handleActionMenu"
          @page-change="changePage"
          @order-change="sort"
          :showDelete="true"
          :first="firstRecord"
          :last="lastRecord"
          :rows="pagination['PagenationDto.PageSize']"
          :totalRecords="pagination.total"
          lazy
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
