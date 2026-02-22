<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useItemHold } from "../composables/useItemHold";


const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const { apiItemHold, loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, onFilterChange, fetchItemHold } = useItemHold();

const customItems = [
    {
        slot: true,
        label: t("button.view"),
        icon: "Eye",
        color: "#3F5FAC",
        action: 'view',
    },
];
onMounted(() => {
    fetchItemHold();
});
const filtersOperation = computed(() => {
    return [
        {
            placeholder: "operation.allTypes",
            value: null,
            field: "type",
            options: [
                { label: t("operation.allTypes"), value: null },
                { label: t("operation.reservation"), value: "Reservations" },
                { label: t("itemHold.qcHold"), value: "QCHold" },
                { label: t("itemHold.DamageHold"), value: "DamageHold" },
                { label: t("itemHold.Investigation"), value: "Investigation" },
            ],
        }
    ]
});

const columns = computed(() => {
    const Columns = [
        { field: 'code', header: t('operation.code'), sortable: true },
        { field: 'itemName', header: t('operation.itemName'), sortable: true },
        { field: 'warehouseName', header: t('operation.warehouse'), sortable: true },
        { field: 'zone', header: t('operation.zone'), sortable: true },
        { field: 'quantity', header: t('operation.quantity'), type: 'slot', sortable: true },
        { field: 'type', header: t('operation.type'), sortable: true },
        { field: 'reason', header: t('operation.reason'), sortable: true },
        { field: 'holdDate', header: t('operation.date'), type: 'date', sortable: true },
        { field: 'serial', header: t('operation.serial'), type: 'slot' },
        { field: 'release', header: t('operation.action'), type: 'slot' },
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
            name: "ItemHoldFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "ItemHoldFormView",
            params: { id: data.id },
        });
    }
    if (action === 'delete') {
        confirmDelete(data);
    }
};

const addItemHold = () => {
    router.push({ name: 'ItemHoldCreate' });
};
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="operation.title" actionName="operation.itemHold" />
        <card class="bg-white rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="operation.itemHoldRelease" subtitle="operation.itemHoldReleaseDescription"
                    :showExport="false" :showImport="false" :mainBtn="true" mainBtnText="operation.createHold"
                    :showFilter="true" :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="operation.itemHoldSearchPlaceholder" @search="onSearch"
                    :onMainBtnClick="addItemHold" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiItemHold" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage"
                    @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount" @search="onSearch" lazy>
                    <template v-slot:["col-type"]="{ data }">
                        <div
                            class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-primary-50 text-primary-500">
                            <span v-if="data.type == 'Reservations'">{{ $t("operation.reservation") }}</span>
                            <span v-else-if="data.type == 'QCHold'">{{ $t("operation.qcHold") }}</span>
                            <span v-else-if="data.type == 'DamageHold'">{{ $t("itemHold.DamageHold") }}</span>
                            <span v-else-if="data.type == 'Investigation'">{{ $t("itemHold.Investigation") }}</span>
                        </div>
                    </template>
                    <template v-slot:["col-serial"]="{ data }">
                        <div v-if="data.hasSerial" class="flex align-items-center justify-center">
                            <VsxIcon iconName="Eye" type="linear" class="cursor-pointer" />
                        </div>
                    </template>
                    <template v-slot:["col-release"]>
                        <div
                            class="cursor-pointer flex align-items-center justify-center rounded gap-1 p-1 text-sm text-success-500">
                            <VsxIcon iconName="Unlock" type="linear" />
                            <span>{{ $t('operation.release') }}</span>
                        </div>
                    </template>
                </DynamicTable>

                <div class="grid grid-cols-2 gap-3 mt-5">
                    <div class="p-5 bg-primary-50 border border-primary-400 rounded-xl">
                        <p>
                            <strong>{{ $t("itemHold.holdTypesTitle") }}</strong>
                        </p>

                        <div class="px-5 text-sm mt-2 space-y-1">
                            <p>
                                <strong>{{ $t("itemHold.qcHoldLabel") }} </strong>
                                {{ $t("itemHold.qcHoldDescription") }}
                            </p>

                            <p>
                                <strong>{{ $t("itemHold.reservationLabel") }} </strong>
                                {{ $t("itemHold.reservationDescription") }}
                            </p>

                            <p>
                                <strong>{{ $t("itemHold.damageHoldLabel") }} </strong>
                                {{ $t("itemHold.damageHoldDescription") }}
                            </p>

                            <p>
                                <strong>{{ $t("itemHold.investigationLabel") }} </strong>
                                {{ $t("itemHold.investigationDescription") }}
                            </p>
                        </div>
                    </div>

                    <div class="p-5 bg-warning-50 border border-warning-400 rounded-xl">
                        <p>
                            <strong>{{ $t("itemHold.importantNotesTitle") }}</strong>
                        </p>

                        <div class="px-5 text-sm mt-2 space-y-1">
                            <p>• {{ $t("itemHold.note1") }}</p>
                            <p>• {{ $t("itemHold.note2") }}</p>
                            <p>• {{ $t("itemHold.note3") }}</p>
                        </div>
                    </div>
                </div>

            </template>
        </card>


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

.status-active {
    background: var(--color-success-500);
    outline: 1px solid var(--color-success-500);
}

.status-inactive {
    background: var(--color-warning-500);
    outline: 1px solid var(--color-warning-500);
}

.status-text-active {
    color: var(--color-success-500);
}

.status-text-inactive {
    color: var(--color-warning-500);
}
</style>