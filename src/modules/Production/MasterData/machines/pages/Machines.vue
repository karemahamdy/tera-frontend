<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useMachines } from "../composables/useMachines";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const { loading, toggleActive, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, deleteMachines, onFilterChange, fetchMachines, apiMachines } = useMachines();

const emit = defineEmits(['search', 'action-menu-click']);
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

onMounted(() => {
    fetchMachines();
});
const filtersOperation = computed(() => {
    return [
        {
            placeholder: "workCenter.workCenter",
            value: null,
            field: "WorkCenterId",
            // options: [
            //     { label: t("usersManagement.allStatus"), value: null },
             
            // ],
        },
        {
            placeholder: "status",
            value: null,
            field: "IsActive",
            options: [
                { label: t("usersManagement.allStatus"), value: null },
                { label: t("button.active"), value: true },
                { label: t("button.inactive"), value: false },
            ],
        },
    ]
});

const columns = computed(() => {
    const Columns = [
        { field: 'machineCode', header: t('machines.code'), sortable: true },
        { field: 'machineName', header: t('machines.name'), type: 'slot', sortable: true },
        { field: 'workCenterName', header: t('machines.workCenter'), type: 'slot', sortable: true },
        { field: 'costPerHour', header: t('machines.HourCost'), sortable: true },
        { field: 'machineCapacity', header: t('machines.Capacity'), type: 'slot', sortable: true },
        { field: 'isActive', header: t('status'), type: 'status', sortable: true },
        { field: 'action', header: t('action') }
    ];

    return Columns;
});

const firstRecord = computed(() => {
     if (!totalCount.value || totalCount.value === 0) return 0;
    return ((pageIndex.value - 1) * pageSize.value) + 1;
});

const lastRecord = computed(() => {
     if (!totalCount.value || totalCount.value === 0) return 0;
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
    if (action === 'edit') {
        router.push({
            name: "machinesFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "MachinesFormView",
            params: { id: data.id },
        });
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
    await deleteMachines(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const addmachines = () => {
    router.push({ name: 'MachinesCreate' });
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="production" subtitle="masterData" actionName="machines.machines" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="machines.machines" subtitle="machines.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="machines.addNew" :showFilter="true"
                    :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="machines.searchPlaceholder" @search="onSearch" :onMainBtnClick="addmachines" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiMachines" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage"
                    @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount" @search="onSearch" lazy>
                    <template v-slot:["col-code"]="{ data }">
                       <span class="text-primary-500 cursor-pointer">{{ data.code }}</span>
                    </template>
                    <template v-slot:["col-department"]="{ data }">
                        <div class="flex items-center gap-2 w-full">
                            <ProgressBar class="flex-1 progress-bar-small" :value="data.department" :show-value="false"
                                style="background-color: #E1E7F4;"
                                :class="data.department > 60 ? 'progress-green' : 'progress-orange'" />
                            <span>{{ data.department }}</span>
                        </div>
                    </template>
                </DynamicTable>
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('machines.deleteConfirm')"
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
:deep(.progress-bar-small) {
  height: 8px !important; 
  border-radius: 4px;     
}
:deep(.progress-green .p-progressbar-value) {
  background-color: #16a34a !important;
}

:deep(.progress-orange .p-progressbar-value) {
  background-color: #f59e0b !important; 
}

:deep(.progress-bar-small .p-progressbar-value) {
  height: 8px !important;
  border-radius: 4px;
}
</style>