<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useItemHold } from "../composables/useItemHold";
import ItemHoldInfo from "../components/ItemHoldInfo.vue";
import alertIcon from "@/assets/images/alert.png";
import ItemHoldSerial from "../components/ItemHoldSerial.vue";
 
const { t } = useI18n();
const router = useRouter();
const showReleaseDialog = ref<boolean>(false);
const rowToRelease = ref<any | null>(null);
const ItemHoldSerialRef = ref<InstanceType<typeof ItemHoldSerial> | null>(null);

const confirmationTitle = computed(() => {
    return t('itemHold.releaseItemConfirm');
});
const { apiItemHold, loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, onFilterChange, fetchItemHold, releaseItem } = useItemHold();

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

const confirmRelease = (row: any) => {
    rowToRelease.value = row;
    showReleaseDialog.value = true;
};


const getSerial = (row: any) => {
    if(ItemHoldSerialRef.value) {
        ItemHoldSerialRef.value.getSerailDialog(row)

    }
};

const addItemHold = () => {
    router.push({ name: 'ItemHoldCreate' });
};

const handleReleaseConfirm = async () => {
    showReleaseDialog.value = false;
    await releaseItem({
        transactionLineId: rowToRelease.value.transactionLineId,
        itemId: rowToRelease.value.itemId
    })
}
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
                <DynamicTable :columns="columns" :data="apiItemHold" :loading="loading"
                    @page-change="setPage"
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
                            <VsxIcon iconName="Eye" type="linear" class="cursor-pointer" @click="getSerial(data)" />
                        </div>
                    </template>
                    <template v-slot:["col-release"]="{ data }">
                        <div
                            @click="confirmRelease(data)"
                            class="cursor-pointer flex align-items-center justify-center rounded gap-1 p-1 text-sm text-success-500">
                            <VsxIcon iconName="Unlock" type="linear" />
                            <span>{{ $t('operation.release') }}</span>
                        </div>
                    </template>
                </DynamicTable>
                <ItemHoldInfo />

            </template>
        </card>
        <StatusDialog
            v-model:visible="showReleaseDialog"
            :icon="alertIcon"
            :title="confirmationTitle"
            :buttons="[
                { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
                { label: $t('operation.release'), variant: 'primary', action: 'confirm' },
            ]"
            @confirm="handleReleaseConfirm"
            />
        <ItemHoldSerial ref="ItemHoldSerialRef" :selectedItem="rowToRelease" />
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