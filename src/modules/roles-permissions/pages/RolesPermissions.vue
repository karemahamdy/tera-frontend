<script setup>
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from "@/assets/images/alert.png";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSearch } from "@/composables/useSearch";
import { useRolesStore } from "../store/useRolesStore";

const store = useRolesStore();

const { t } = useI18n();
const router = useRouter();
const loading = ref(false);
const showDeleteDialog = ref(false);
const rowToDelete = ref(null);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
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

const { filteredData } = useSearch(props.data);

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
    { field: "createAt", header: t("table.created"), sortable: true, type: "date" },
    { field: "action", header: t("table.action") },
  ];

  return Columns;
});

const firstRecord = computed(() => {
  return store.list.length === 0 
    ? 0 
    : (store.pagination['PagenationDto.PageIndex'] - 1) * store.pagination['PagenationDto.PageSize'] + 1;
});

const lastRecord = computed(() => {
  if (store.list.length === 0) return 0;
  const last = firstRecord.value + store.list.length - 1;
  return last > store.pagination.total ? store.pagination.total : last;
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

onMounted(()=>{
  store.getList()
})
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
          @search="store.search"
          :onMainBtnClick="addNew"
        />
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <DynamicTable
          :columns="columns"
          :data="store.list"
          :loading="loading"
          :permissionItems="permissionItems"
          :customItems="customItems"
          @action-menu-click="handleActionMenu"
          @page-change="store.changePage"
          @order-change="store.sort"
          :showDelete="true"
          :first="firstRecord"
          :last="lastRecord"
          :rows="store.pagination['PagenationDto.PageSize']"
          :totalRecords="store.pagination.total"
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
