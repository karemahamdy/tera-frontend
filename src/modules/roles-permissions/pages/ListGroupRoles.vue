<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from "@/assets/images/alert.png";

import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useGroupRoles } from "../composables/assignRolesToGroup";
import type { GroupRoleTableRow } from "../types/userGroupRoles";

const { t } = useI18n();
const router = useRouter();

const showDeleteDialog = ref(false);
const rowToDelete = ref<any>(null);
const isDeleting = ref(false);

const groupId = computed(() => router.currentRoute.value.params.id as string);

const {
    tableData,
    loading,
    fetchRolesByGroupId,
    deleteRoleFromGroup
} = useGroupRoles();

onMounted(() => {
    fetchRolesByGroupId(groupId.value);
});

const columns = computed(() => [
    { field: "roleName", header: t("roles.roleName"), sortable: true },
    { field: "accessScope", header: t("roles.accessScope"), sortable: true },
    { field: "branches", header: t("roles.branches"), type: 'badge', Class: 'custom-badge' },
    { field: "action", header: t("action") }
]);

const confirmDelete = (row: any) => {
    rowToDelete.value = row;
    showDeleteDialog.value = true;
};

const onEdit = (row: GroupRoleTableRow) => {
    router.push({
        name: 'AddGroupRoles',
        params: {
            groupId: groupId.value,
            roleId: row.roleId
        }
    });
};

const handleDeleteConfirm = async () => {
    if (!rowToDelete.value || !rowToDelete.value.roleId) return;
    isDeleting.value = true;
    const payload = { groupId: groupId.value, roleId: rowToDelete.value.roleId };
    await deleteRoleFromGroup(payload).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const handleActionMenu = (payload: any) => {
    const action = payload.action || payload;
    const data = payload.data || payload.row || payload;
    if (action === 'delete') confirmDelete(data);
    if (action === 'edit') onEdit(data);
};

const goToAddRole = () => {
    router.push({ name: "RolesPermissions" });
};

const handleDialogCancel = () => {
    showDeleteDialog.value = false;
    rowToDelete.value = null;
};
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="accessControl" subtitle="userGroup.userGroup" actionName="roles.assignRole" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="roles.rolesTitle" subtitle="roles.rolesDescription" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="roles.addNewRole" :onMainBtnClick="goToAddRole"
                    :showSearch="false" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="tableData" :loading="loading || isDeleting"
                    @action-menu-click="handleActionMenu" :showDelete="true" :showSearch="false" />
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon"
            title="Are you sure you want to delete this role?" :buttons="[
                { label: 'Cancel', variant: 'ghost', action: 'cancel' },
                { label: 'Yes, Delete', variant: 'danger', action: 'confirm' }
            ]" @confirm="handleDeleteConfirm" @cancel="handleDialogCancel" />

    </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 16px;
    color: var(--color-gray-500);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background: #FAF9F9;
    font-weight: 600;
    color: var(--color-gray-700);
    font-size: 13px;
    padding: 20px 16px;
}
</style>