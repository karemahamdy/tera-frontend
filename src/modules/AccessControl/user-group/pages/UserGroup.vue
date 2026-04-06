<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import alertIcon from "@/assets/images/alert.png";
import { useGroups } from "../composables/useGroups";
import type { GroupTableItem } from "../types/groups";
import { toastService } from "@/app/services/toastService";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<GroupTableItem | null>(null);
const isDeleting = ref(false);

const {
  loading,
  fetchGroups,
  filteredTableData,
  deleteGroup,
  toggleActive,
  pageIndex,
  pageSize,
  totalCount,
  onSearch,
  onSort,
  setPage,
  importUsers
} = useGroups();

onMounted(() => {
  fetchGroups();
});

const permissionItems = [
  {
    label: "button.new",
    icon: "Star1",
    color: "#12B76A",
    command: (row: GroupTableItem) => {
      if(row.isActive){
        router.push(`/roles-permissions/add-group-roles/${row.id}`);
      } else {
        toastService.error(t("roles.roleNotActive"));
      }
    },
  },
  {
    label: "button.view",
    icon: "Eye",
    color: "#3F5FAC",
    command: (row: GroupTableItem) => {
      router.push(`/roles-permissions/list-group-roles/${row.id}`);
    },
  },
];

const customItems = computed(() => {
  return [
    {
      action: "toggleActive",
      changeStatus: true,
      label: t("button.active"),
      type: "switch",
      key: "isActive",
    },
  ];
});

const columns = computed(() => {
  const Columns = [
    {
      field: "GroupName",
      header: t("userGroup.groupName"),
      type: "slot",
      sortable: true,
    },
    {
       field: "code",
       header: t("userGroup.code"),
       type: "slot",
       sortable: true,
     }, 
    {
      field: "Description",
      header: t("userGroup.description"),
      sortable: true,
    },
    {
      field: "AssignedRoles",
      header: t("userGroup.assignedRoles"),
      sortable: true,
      type: "tag",
      Class: "custom-tag",
    },
    {
      field: "userAssigned",
      header: t("userGroup.userCount"),
      sortable: true,
      type: "badge",
      Class: "custom-badge",
    },
    {
      field: "createAt",
      header: t("userGroup.created"),
      type: "date",
      sortable: true,
    },
    { field: "permission", header: t("permission") },
    { field: "action", header: t("action") },
  ];

  return Columns;
});

const firstRecord = computed(() => {
  return (pageIndex.value - 1) * pageSize.value + 1;
});

const lastRecord = computed(() => {
  const last = pageIndex.value * pageSize.value;
  return Math.min(last, totalCount.value || last);
});

const confirmDelete = (row: GroupTableItem) => {
  rowToDelete.value = row;
  showDeleteDialog.value = true;
};

const handleActionMenu = async (payload: any) => {
  const action = payload.action || payload;
  const data = payload.data || payload.row || payload;
  if (action === "delete") {
    if (data && data.id) {
      confirmDelete(data);
    }
  }
  if (action === "edit") {
    if (data && data.id) {
      handleEdit(data);
    }
  }
  if (action === "toggleActive") {
     if (loading.value) return;
    await toggleActive(data.id, !data.isActive);
  }
};

const handleDeleteConfirm = async () => {
  if (!rowToDelete.value) return;
  isDeleting.value = true;
  await deleteGroup(rowToDelete.value.id).finally(() => {
    isDeleting.value = false;
    showDeleteDialog.value = false;
    rowToDelete.value = null;
  });
};

const handleDialogCancel = () => {
  showDeleteDialog.value = false;
  rowToDelete.value = null;
};
const handleEdit = (row: GroupTableItem) => {
  router.push(`/user-group/edit/${row.id}`);
};

const addUserGroup = () => {
  router.push("/user-group/create");
};
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="accessControl" subtitle="userGroup.userGroup" />
    <card class="bg-white rounded-[10px]">
      <template #title>
        <PageHeader
          title="userGroup.userGroup"
          subtitle="userGroup.userGroupDescription"
          :showExport="true"
          :showImport="true"
          :mainBtn="true"
          mainBtnText="userGroup.addUserGroup"
          :onMainBtnClick="addUserGroup"
          @search="onSearch"
          hasMenu
          templateFileUrl="/Group/DownloadImportTemplate"
          dataFileUrl="/Group/ExportGroup"
          templateFileName="group-template.xlxs"
          dataFileName="group-data.xlxs"
          @upload="importUsers"
        />
      </template>

      <template #content>
        <DynamicTable
          :columns="columns"
          :data="filteredTableData"
          :loading="loading || isDeleting"
          :customItems="customItems"
          :permissionItems="permissionItems"
          :showDelete="true"
          @action-menu-click="handleActionMenu"
          @page-change="setPage"
          :first="firstRecord"
          :last="lastRecord"
          :rows="pageSize"
          :totalRecords="totalCount"
           @search="onSearch"
            @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" 
          lazy
        >
          <template #col-GroupName="{ data }">
            <div class="flex items-start gap-2 flex-nowrap">
              <VsxIcon iconName="People" :size="24" color="#717680" />
              <span class="break-words">{{ data.GroupName }}</span>
            </div>
          </template>
          <template #col-AssignedRoles="{ data }">
            <div class="flex flex-wrap gap-2">
              <Tag
                v-for="(role, index) in data.AssignedRoles"
                :key="index"
                :value="role"
                class="custom-tag"
              />
              <span v-if="data.AssignedRoles.length === 0" class="text-gray-400"
                >-</span
              >
            </div>
          </template>
        </DynamicTable>
      </template>
    </card>

    <StatusDialog
      v-model:visible="showDeleteDialog"
      :icon="alertIcon"
      :title="$t('userGroup.deleteRoleConfirm')"
      :buttons="[
        { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
        { label: $t('button.delete'), variant: 'danger', action: 'confirm' },
      ]"
      @confirm="handleDeleteConfirm"
      @cancel="handleDialogCancel"
    />
  </div>
</template>
<style scoped>
.custom-tag {
  background: var(--color-primary-25);
  color: var(--color-gray-700);
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 300;
}
</style>
