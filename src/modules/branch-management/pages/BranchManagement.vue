<script setup>
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSearch } from "@/composables/useSearch";
import { useBranches } from "../composables/useBranch";
// import  { BranchTableItem } from "../types/branches";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref(null);

const { loading, fetchBranches, filteredTableData, deleteBranch, toggleActive, pageIndex, pageSize, totalCount, setPage } = useBranches();

onMounted(() => {
    fetchBranches();
});
// const props = defineProps({
//     data: {
//         type: Array,
//         default: () => [
//             {
//                 id: 1,
//                 branchName: 'Finance Team',
//                 address: 'Manage payment, budget..',
//                 code: '4',
//                 status: "in Active",

//                 Created: 'Oct 11, 2025',
//             },
//             {
//                 id: 5,
//                 branchName: 'Finance Team',
//                 address: 'Manage payment, budget..',
//                 code: '2',
//                 status: "Active",
//                 Created: 'Oct 11, 2025',
//             },
//         ]
//     },
// });

const emit = defineEmits(['search', 'action-menu-click']);

const customItems = [
    {
        slot: true,
        changeStatus: true,
        label: t("button.active"),
        command: (row) => {
            console.log("toggle", row);
        }
    },
];
// const { onSearch, filteredData } = useSearch(props.data);

const columns = computed(() => {
    const Columns = [
        { field: 'nameAr', header: t('branch.branchName'), type: 'slot', sortable: true },
        { field: 'nameEn', header: t('branch.branchName'), type: 'slot', sortable: true },
        { field: 'code', header: t('branch.code'), sortable: true, type: 'badge', Class: 'custom-badge' },
        { field: 'address', header: t('branch.address'), sortable: true },
        { field: 'isActive', header: t('status'), sortable: true },
        { field: 'createAt', header: t('table.created'), type: 'date', sortable: true },
        { field: 'action', header: t('action') }
    ];

    return Columns;
});

const firstRecord = computed(() => {
    return ((pageIndex.value - 1) * pageSize.value) + 1;
});

const lastRecord = computed(() => {
    const last = pageIndex.value * pageSize.value;
    return Math.min(last, totalCount.value || last);
});


const confirmDelete = (row) => {
    rowToDelete.value = row;
    console.log("Row to delete:", rowToDelete.value);
    showDeleteDialog.value = true;
};

const handleActionMenu = ({ action, data }) => {
    if (action === "edit") {
        if (data && data.id) {
            handleEdit(data);
        }
    }
    if (action === 'delete') {
        confirmDelete(data);
    }
};

const handleDeleteConfirm = () => {
    console.log("Deleted user with ID:", rowToDelete.value);
    showDeleteDialog.value = false;
    rowToDelete.value = null;
};
const handleEdit = (row) => {
    router.push(`/branch-management/edit/${row.id}`);
};

const addBranch = () => {
    router.push('/branch-management/create');
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="accessControl" subtitle="branch.branchManagement" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="branch.branchManagement" subtitle="branch.branchDescription" :showExport="true"
                    :showImport="true" :mainBtn="true" mainBtnText="branch.addBranch"
                    searchPlaceholder="branch.searchPlaceholder" @search="onSearch" :onMainBtnClick="addBranch" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="filteredTableData" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true"  @page-change="setPage" :first="firstRecord" :last="lastRecord"
                    :rows="pageSize" :totalRecords="totalCount" lazy>
                    <template #col-GroupName="{ data }">
                        <div class="flex items-start gap-2 flex-wrap">
                            <VsxIcon iconName="Building4" :size="24" color="#717680" type="linear" />
                            <span class="break-words">{{ data.GroupName }}</span>
                        </div>
                    </template>
                </DynamicTable>
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('branch.deleteBranchConfirm')"
            :buttons="[
                { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
                { label: $t('button.delete'), variant: 'danger', action: 'confirm' },
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