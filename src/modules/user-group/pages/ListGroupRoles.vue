<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
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

const permissionItems = [
    {
        label: "New",
        icon: "Star1",
        color: "#12B76A",
        command: (row) => {
            console.log("ROW", row);
            router.push(`/add-group-roles/${row.id}`);
        }
    },
    {
        label: "view",
        icon: "Eye",
        color: "#3F5FAC",
        command: (row) => {
            router.push(`/list-group-roles/${row.id}`);
        }
    }
];

const menuItems = [
    {
        label: "Active",
        icon: "Activity",
        color: "#12B76A",
        command: (row) => {
            console.log("Toggle Active clicked:", row);
            row.status = row.status === "Active" ? "Inactive" : "Active";
        }
    }
];

const { onSearch, filteredData } = useSearch(props.data);

const columns = computed(() => {
    const Columns = [
        { field: 'RoleName', header: t('roles.roleName'), type: 'slot', sortable: true },
        { field: 'Accessscope', header: t('roles.accessScope'), sortable: true },
        { field: 'Branches', header: t('roles.branches'), sortable: true, type: 'badge', Class: 'custom-badge' },
        { field: 'action', header: t('action') }
    ];

    return Columns;
});

const confirmDelete = (row) => {
    rowToDelete.value = row;
    console.log("Row to delete:", rowToDelete.value);
    showDeleteDialog.value = true;
};

const handleActionMenu = ({ action, data }) => {
    console.log("ActionMenu Data:", data);
    if (action === 'delete') {
        confirmDelete(data);
    }
};

const handleDeleteConfirm = () => {
    console.log("Deleted user with ID:", rowToDelete.value?.id);
    showDeleteDialog.value = false;
    rowToDelete.value = null;
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="layout.accessControl" subtitle="userGroup.userGroup" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="roles.rolesTitle" subtitle="roles.rolesDescription"
                    :showExport="false" :showImport="false" :mainBtn="true" mainBtnText="roles.addNewRole"
                    :showSearch="false"/>
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="filteredData" :loading="loading" :menuItems="menuItems"
                    :permissionItems="permissionItems" @action-menu-click="handleActionMenu" :showDelete="true" :showSearch="false">
                    <template #col-GroupName="{ data }">
                        <div class="flex items-start gap-2 flex-wrap">
                            <VsxIcon iconName="People" :size="24" color="#717680" type="linear" />
                            <span class="break-words">{{ data.GroupName }}</span>
                        </div>
                    </template>
                </DynamicTable>
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