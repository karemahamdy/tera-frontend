<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useWarehouse } from "../composables/usewarehouse";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);

const { loading, apiWarehouse, toggleActive, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, fetchWarehouse, onFilterChange, importWarehouse, deleteWarehouse, exportWarehouse } = useWarehouse();

onMounted(() => {
    fetchWarehouse();
});

const customItems = [
    {
        action: "toggleActive",
        changeStatus: true,
        label: t("button.active"),
        type: "switch",
        key: "isActive",
    },
    {
        slot: true,
        label: t("button.view"),
        icon: "Eye",
        color: "#3F5FAC",
        action: 'view',
    },
];

const filtersOperation = computed(() => {
    return [
        {
            placeholder: "warehouses.type",
            value: null,
            field: "type",
            options: [
                { label: t("button.all"), value: "" },
                { label: t("button.professional"), value: "professional" },
                { label: t("button.normal"), value: "normal" },
            ],
        },
        {
            placeholder: "activeSessions.status",
            value: null,
            field: "status",
            options: [
                { label: t("button.all"), value: "" },
                { label: t("button.active"), value: "true" },
                { label: t("button.inactive"), value: "false" },
            ],
        }
    ]
});

const columns = computed(() => {
    const Columns = [
        { field: 'code', header: t('warehouses.code'), sortable: true },
        { field: 'name', header: t('warehouses.name'), type: 'slot', sortable: true },
        { field: 'type', header: t('warehouses.type'), type: 'slot', sortable: true },
        { field: 'address', header: t('warehouses.address'), sortable: true },
        { field: 'zonesCount', header: t('warehouses.zones'), sortable: true },
        { field: 'transferAccount', header: t('warehouses.transferAccount'), sortable: true },
        { field: 'isActive', header: t('status'), type: 'status', sortable: true },
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
    await deleteWarehouse(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const handleEdit = (row: any) => {
    router.push(`/warehouses/edit/${row.id}`);
};

const addBranch = () => {
    router.push('/warehouses/create');
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="masterData" actionName="warehouses.title" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="warehouses.title" subtitle="warehouses.subtitle" :showExport="true"
                    :showImport="true" :mainBtn="true" mainBtnText="warehouses.addWarehouse" :showFilter="true"
                    :filters="filtersOperation" searchPlaceholder="warehouses.searchPlaceholder" @search="onSearch"
                    :onMainBtnClick="addBranch" @filter-change="onFilterChange" hasMenu @upload="importWarehouse"
                    :onExportData="exportWarehouse" templateFileUrl="/Warehouses/DownloadImportTemplate"
                    templateFileName="Warehouses-data.csv" dataFileName="Warehouses-data.csv" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiWarehouse" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage"
                    @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount" @search="onSearch" lazy>
                    <template  v-slot:["col-type"]="{ data }">
                        <Badge class="px-3 py-1 rounded-full text-sm font-medium" :class="data.type === 'Professional'
                            ? 'custom-badge'
                            : 'prof-badge'">
                            {{ data.type }}
                        </Badge>
                    </template>

                </DynamicTable>

            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon"
            :title="$t('warehouses.deleteWarehousesConfirm')" :buttons="[
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
.custom-badge {
  background: var(--color-primary-50);
  color: var(--color-primary-500);
  padding: 16px 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.prof-badge {
  background: var(--color-gray-100);
  color: var(--color-gray-500);
  padding: 16px 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

</style>