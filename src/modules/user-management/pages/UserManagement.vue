<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from "@/assets/images/alert.png";

import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import ChangePassword from "@/sharedComponents/ChangePassword.vue";
import type { UserListItem } from "../types/User";
import { useUsers } from "../composables/useUsers";

const { list, pagination, changePage, getList, search, sort, deleteItem, onFilterChange } =
  useUsers();

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const showDialog = ref(false);
const rowToDelete = ref<UserListItem | null>(null);

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
      { label: "active", value: "IsActive" },
      { label: "inactive", value: "InActive" },
    ],
  },
  {
    placeholder: "usersManagement.allScopes",
    value: null,
    field: "accessScope",
    options: [
      { label: "usersManagement.allScopes", value: null },
      { label: "Global", value: "Global" },
      { label: "Branch", value: "BranchLimited" },
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
    { field: "isGlobal", header: t("roles.accessScope"), sortable: true },
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
  } else if (action === "resetPassword") showResetDialog(data);
};

const handleDeleteConfirm = async () => {
  console.log(rowToDelete.value);
  if (!rowToDelete.value) return;
  showDeleteDialog.value = false;

  await deleteItem(rowToDelete.value.userId);
  rowToDelete.value = null;
};

const addUserGroup = () => {
  router.push("/user-management/create");
};

onMounted(() => {
  getList();
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
          @action-menu-click="handleActionMenu"
          @page-change="changePage"
          @order-change="sort"
        >
          <template v-slot:["col-isGlobal"]="{ data }">
              <div>
                {{ data.isGlobal ? $t('users.global') : $t('users.branch') }}
              </div>
          </template>
          <template v-slot:["col-fullName"]="{ data }">
            <div class="flex items-center gap-2 rounded">
              <Badge
                v-if="data.isAdmin"
                severity="warn"
                class="circle-badge-sm"
              >
                <VsxIcon iconName="Award" :size="20" type="linear" />
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
          <!-- @vue-ignore -->
          <template #menu-item="{ item, row }" class="">
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

</style>
