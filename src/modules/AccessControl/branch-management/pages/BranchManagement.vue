<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useBranches } from "../composables/useBranch";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);

const { loading, fetchBranches, filteredTableData, deleteBranch, toggleActive, pageIndex, pageSize, totalCount, onSearch, onSort, setPage } = useBranches();

onMounted(() => {
    fetchBranches();
});
const emit = defineEmits(['search', 'action-menu-click']);
const customItems = [
    {
        action: "toggleActive",
        changeStatus: true,
        label: t("button.active"),
        type: "switch",
        key: "isActive",
    },
];

const columns = computed(() => {
    const Columns = [
        { field: 'name', header: t('branch.branchName'), type: 'slot', sortable: true },
        { field: 'code', header: t('branch.code'), sortable: true, type: 'badge', Class: 'custom-badge' },
        { field: 'addressEn', header: t('branch.address'), sortable: true },
        { field: 'status', header: t('status'), type: 'status', sortable: true },
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

const confirmDelete = (row: any) => {
    rowToDelete.value = row;
    showDeleteDialog.value = true;
};

const handleActionMenu = async (payload: any) => {
    const action = payload.action || payload;
    const data = payload.data || payload.row || payload;
    if (action === "edit") {
        if (data && data.id) {
            handleEdit(data);
        }
    }
    if (action === 'delete') {
        confirmDelete(data);
    }
    if (action === "toggleActive") {
        if (loading.value) return;
        await toggleActive(data.id, !data.isActive);
    }
};

const handleDeleteConfirm = async () => {
    if (!rowToDelete.value) return;
    isDeleting.value = true;
    await deleteBranch(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const handleEdit = (row: any) => {
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
                <PageHeader title="branch.branchManagement" subtitle="branch.branchDescription" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="branch.addBranch"
                    searchPlaceholder="branch.searchPlaceholder" @search="onSearch" :onMainBtnClick="addBranch" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="filteredTableData" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy>
                    <template v-slot:["col-name"]="{ data }">
                        <div class="flex items-start gap-2 flex-wrap">
                            <VsxIcon iconName="Building4" :size="24" color="#717680" type="linear" />
                            <span class="break-words">{{ data.name }}</span>
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