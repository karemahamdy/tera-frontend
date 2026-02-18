<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const data = ref([
    {
        id: "111-111-11",
        itemCode: "ITM-045",
        itemName: "Steel 10mm",
        warehouse: "WH-045",
        zone: "Zone B",
        systemBalance: "50 Pcs",
        countedQTY: 0,
        variances: 0
    },
])

const columns = computed(() => {
    const Columns = [
        { field: 'itemCode', header: t('PhysicalCount.ItemCode') },
        { field: 'itemName', header: t('PhysicalCount.ItemName') },
        { field: 'warehouse', header: t('PhysicalCount.warehouse') },
        { field: 'zone', header: t('PhysicalCount.zone') },
        { field: 'systemBalance', header: t('PhysicalCount.SystemBalance') },
        { field: 'countedQTY', header: t('PhysicalCount.CountedQTY') },
        { field: 'variances', header: t('PhysicalCount.Variances') },
        { field: 'serial', header: t('serial.serial') },
        { field: 'delete', header: t('action') }
    ];
    return Columns;
});

const addItem = () => {
    alert("hi")
};

const getSerail = (id: string) => {
    alert(id)
};

const deleteItem = (id: string) => {
    alert(id)
};
</script>

<template>
    <div>
        <PageHeader title="PhysicalCount.LineItems"
            subtitle="PhysicalCount.LineItemsInfo"
            :showSearch="false" :mainBtn="true" mainBtnText="Add Item" :onMainBtnClick="addItem" />

        <DynamicTable :columns="columns" :data="data" :paginator="false">
            <template v-slot:["col-serial"]="{ data }">
                <VsxIcon class="cursor-pointer text-primary-500" iconName="Eye" :size="24" type="linear"
                    @click="getSerail(data.id as string)" />
            </template>
            <template v-slot:["col-delete"]="{ data }">
                <VsxIcon class="cursor-pointer text-danger-500" iconName="Trash" :size="24" type="linear"
                    @click="deleteItem(data.id as string)" />
            </template>
        </DynamicTable>
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