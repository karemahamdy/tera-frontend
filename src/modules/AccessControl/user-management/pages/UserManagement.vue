<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from "@/assets/images/alert.png";
import { toastService } from "@/app/services/toastService";
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ChangePassword from "@/sharedComponents/ChangePassword.vue";
import type { UserListItem } from "../types/User";
import { useLookups } from "@/composables/useLookups";
import { useUsers } from "../composables/useUsers";

const { list, pagination, changePage, getList, search, sort, deleteItem, onFilterChange, changeUserStatus, resetPassword, importUsers } =
  useUsers();

const { groupsLookups, departmentsLookups, getDepartmentsLookups, getGroupLookups } = useLookups();  
const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const showDialog = ref(false);
const rowToDelete = ref<UserListItem | null>(null);
const selectedUserId = ref<string | null>(null);

const permissionItems = [
  {
    label: "button.new",
    icon: "Star1",
    color: "#12B76A",
    command: (row: any) => {
      if(row.isActive){
        router.push(`/roles-permissions/add-user-roles/${row.userId}`);
      } else {
        toastService.error(t("roles.userNotActive"));
      }
    },
  },
  {
    label: "button.view",
    icon: "Eye",
    color: "#3F5FAC",
    command: (row: any) => {
      router.push(`/roles-permissions/list-user-roles/${row.userId}`);
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
      action: "toggleActive",
      changeStatus: true,
      label: t("button.active"),
      type: "switch",
      key: "isActive",
    },
  ];
});

const firstRecord = computed(() => {
  return list.value.length === 0
    ? 0
    : (pagination.value.PageIndex - 1) * pagination.value.PageSize + 1;
});

const lastRecord = computed(() => {
  if (list.value.length === 0) return 0;
  const last = firstRecord.value + list.value.length - 1;
  return last > pagination.value.total ? pagination.value.total : last;
});

const filtersOperation = computed(() => {
  return [
    {
      placeholder: "usersManagement.allGroups",
      value: null,
      field: "userGroup",
      options: [
        { label: t("usersManagement.allGroups"), value: null },
        ...groupsLookups.value
      ],
    },
    {
      placeholder: "usersManagement.allStatus",
      value: null,
      field: "status",
      options: [
        { label: t("usersManagement.allStatus"), value: null },
        { label: t("button.active"), value: "IsActive" },
        { label: t("button.inactive"), value: "InActive" },
      ],
    },
    {
      placeholder: "usersManagement.allScopes",
      value: null,
      field: "accessScope",
      options: [
        { label: t("usersManagement.allScopes"), value: null },
        { label: t("users.global"), value: 1 },
        { label: t("users.branch"), value: 2 },
      ],
    },
    {
      placeholder: "usersManagement.allDepartment",
      value: null,
      field: "department",
      options: [
        { label: t("usersManagement.allDepartment"), value: null },
        ...departmentsLookups.value
      ],
    },
  ];
});

const columns = computed(() => {
  const Columns = [
    {
      field: "fullName",
      header: t("usersManagement.user"),
      sortable: true,
    },
    {
      field: "group",
      header: t("userGroup.userGroup"),
      sortable: true,
    },
    {
      field: "department",
      header: t("usersManagement.department"),
      sortable: true,
    },
    { field: "accessScope", header: t("roles.accessScope"), sortable: true },
    { field: "isActive", header: t("status"), sortable: true },
    {
      field: "lastLogin",
      header: t("usersManagement.lastLogin"),
      type: "date",
      sortable: true,
    },
    { field: "permission", header: t("permission") },
    { field: "action", header: t("action") },
  ];
  return Columns;
});

const confirmDelete = (row: UserListItem) => {
  rowToDelete.value = row;
  showDeleteDialog.value = true;
};

const showResetDialog = (row: any) => {
  selectedUserId.value = row.userId;
  rowToDelete.value = row;
  showDialog.value = true;
};

const handleActionMenu = (payload: any) => {
  const action = payload.action || payload;
  const data = payload.data || payload.row || payload;
  if (action === "delete") {
    if (data && data.userId) {
      confirmDelete(data);
    }
  } else if (action === "edit") {
    if (data && data.userId) {
      const id = data.userId;
      router.push({ name: "UserManagementEdit", params: { id } });
    }
  } else if (action === "resetPassword") {
    showResetDialog(data);
  } else if (action === "toggleActive") {
    changeUserStatus(data.userId, !data.isActive);
  }
};

const handleDeleteConfirm = async () => {
  if (!rowToDelete.value) return;
  showDeleteDialog.value = false;

  await deleteItem(rowToDelete.value.userId);
  rowToDelete.value = null;
};

const addUserGroup = () => {
  router.push("/user-management/create");
};

const handlePasswordChanged = async (values: any) => {
  if (!rowToDelete.value) return;
  await resetPassword({ targetUserId: rowToDelete.value.userId, ...values });
  showDialog.value = false;
  rowToDelete.value = null;
};

onMounted(() => {
  Promise.all([getList(), getGroupLookups(false), getDepartmentsLookups(false)]);
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader
      title="accessControl"
      subtitle="usersManagement.usersManagement"
    />
    <card class="bg-white rounded-[10px]">
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
          @search="search"
          :showFilter="true"
          @filter-change="onFilterChange"
          :rows="pagination.PageSize"
          :totalRecords="pagination.total"
          :first="firstRecord"
          :last="lastRecord"
          :filters="filtersOperation"
          :onMainBtnClick="addUserGroup"
          hasMenu
          templateFileUrl="/Users/DownloadImportTemplate"
          dataFileUrl="/Users/exportUsers"
          templateFileName="user-template.xlxs"
          dataFileName="user-data.xlxs"
          @upload="importUsers"
        />
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <DynamicTable
          :columns="columns"
          :data="list"
          :permissionItems="permissionItems"
          :customItems="customItems"
          :showDelete="true"
          :first="firstRecord"
          :last="lastRecord"
          :rows="pagination.PageSize"
          :totalRecords="pagination.total"
          @action-menu-click="handleActionMenu"
          @page-change="changePage"
          @order-change="sort"
          lazy
        >
          <template v-slot:["col-fullName"]="{ data }">
            <div class="flex items-center gap-2 rounded">
              <Badge
                v-if="data.isAdmin"
                severity="warn"
                class="circle-badge-sm"
              >
                <VsxIcon iconName="Award" :size="20" type="linear" />
              </Badge>
               <Badge
                v-else
                severity="transparent"
                class="circle-badge"
              >
                <VsxIcon iconName="Award" :size="20" type="linear" class="icon-transparent"/>
              </Badge>

              <Avatar :image="data.userProfileImageUrl"
                  :label="!data.userProfileImageUrl ? data.fullName.charAt(0) : ''" shape="circle"
                  class="w-10 h-10 bg-gray-800" />
              <div class="flex flex-col">
                  <div class="text-base text-gray-700">{{ data.fullName }}</div>
                  <div class="text-sm text-gray-500">{{ data.email }}</div>
              </div>
            </div>
          </template>
          <template v-slot:["col-department"]="{ data }">
              <div>
                {{ data.department ? data.department.name : "" }}
              </div>
          </template>
          <template v-slot:["col-group"]="{ data }">
            <Tag v-if="data.group" :value="data.group.name" class="custom-tag" />
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
    <template v-if="showDialog">
      <ChangePassword v-model:visible="showDialog" @passwordChanged="handlePasswordChanged" />
    </template>
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

.custom-tag {
    background: var(--color-primary-25);
    color: var(--color-gray-700);
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 300;
}

.circle-badge-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.circle-badge {
 background-color: transparent;
}
.icon-transparent {
  color: transparent; 
}
</style>
