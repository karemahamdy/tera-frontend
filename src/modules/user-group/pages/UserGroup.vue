<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import alertIcon from "@/assets/images/alert.png";
import { useGroups } from "../composables/useGroups";
import type { GroupTableItem } from "../types/groups";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<GroupTableItem | null>(null);
const isDeleting = ref(false);

const { loading, fetchGroups, filteredTableData, deleteGroup } = useGroups();

onMounted(() => {
  fetchGroups();
});

const permissionItems = [
    {
        label: t("button.new"),
        icon: "Star1",
        color: "#12B76A",
        command: (row: GroupTableItem) => {
            router.push(`/roles-permissions/add-group-roles/${row.id}`);
        }
    },
    {
        label: t("button.view"),
        icon: "Eye",
        color: "#3F5FAC",
        command: (row: GroupTableItem) => {
            router.push(`/roles-permissions/list-group-roles/${row.id}`);
        }
    }
];

const customItems = [
    {
        slot: true,
        changeStatus: true,
        label: t("button.active"),
        command: (row: GroupTableItem) => {
            console.log("toggle", row);
        }
    }
];

const columns = computed(() => {
    const Columns = [
        { field: 'GroupName', header: t('userGroup.groupName'), type: 'slot', sortable: true },
        { field: 'Description', header: t('userGroup.description'), sortable: true },
        { field: 'AssignedRoles', header: t('userGroup.assignedRoles'), sortable: true, type: 'tag', Class: 'custom-tag' },
        { field: 'UserCount', header: t('userGroup.userCount'), sortable: true, type: 'badge', Class: 'custom-badge' },
        { field: 'Created', header: t('userGroup.created'), sortable: true },
        { field: 'permission', header: t('permission') },
        { field: 'action', header: t('action') }
    ];

    return Columns;
});

const confirmDelete = (row: GroupTableItem) => {
    rowToDelete.value = row;
    showDeleteDialog.value = true;
};

const handleActionMenu = (payload: any) => {
    const action = payload.action || payload;
    const data = payload.data || payload.row || payload;
    if (action === "delete") {
        if (data && data.id) {
            confirmDelete(data);  
        } 
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
                >
                    <template #col-GroupName="{ data }">
                        <div class="flex items-start gap-2 flex-wrap">
                            <VsxIcon iconName="People" :size="24" color="#717680" />
                            <span class="break-words">{{ data.GroupName }}</span>
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
                { label: $t('button.delete'), variant: 'danger', action: 'confirm' }
            ]" 
            @confirm="handleDeleteConfirm"
            @cancel="handleDialogCancel"
        />
    </div>
</template>