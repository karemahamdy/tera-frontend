<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

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
                RoleName: 'Finance Team',
                Accessscope: 'Manage payment, budget..',
                Branches: "Administration",
            },
          {
                id: 1,
                RoleName: 'Finance Team',
                Accessscope: 'Manage payment, budget..',
                Branches: "Administration",
            },
        ]
    },
});

const emit = defineEmits(['search', 'action-menu-click']);

const columns = computed(() => {
    const Columns = [
        { field: 'RoleName', header: t('roles.roleName'), type: 'slot', sortable: true },
        { field: 'Accessscope', header: t('roles.accessScope'), sortable: true },
        { field: 'Branches', header: t('roles.branches'), sortable: true, type: 'badge', Class: 'custom-badge' },
        { field: 'action', header: t('action') }
    ];

    return Columns;
});

const confirmDelete = (row: any) => {
    rowToDelete.value = row;
    showDeleteDialog.value = true;
};

const onEdit = () => {
  router.push("/add-user-roles/:id");
};

const handleActionMenu = ({ action, data }: { action: string; data: any }) => {
    if (action === 'delete') {
        confirmDelete(data);
    }
     if (action === 'edit') {
        onEdit();
    }
};

const handleDeleteConfirm = () => {
    showDeleteDialog.value = false;
    rowToDelete.value = null;
};
const goToAddRole = () => {
  router.push("/add-user-roles/:id");
};
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="accessControl" subtitle="usersManagement.usersManagement" actionName="Assign role"/>
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="roles.rolesTitle" subtitle="roles.rolesDescription"
                    :showExport="false" :showImport="false" :mainBtn="true" mainBtnText="roles.addNewRole" :onMainBtnClick="goToAddRole"
                    :showSearch="false"/>
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="data" :loading="loading" 
                   @action-menu-click="handleActionMenu" :showDelete="true" :showSearch="false" />
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon"
            title="Are you sure you want to delete this role?" :buttons="[
                { label: 'Cancel', variant: 'ghost', action: 'cancel' },
                { label: 'Yes, Delete', variant: 'danger', action: 'confirm' }
            ]" @confirm="handleDeleteConfirm" />
 
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