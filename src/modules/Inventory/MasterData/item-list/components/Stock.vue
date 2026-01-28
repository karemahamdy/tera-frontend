<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type VsxIcon from "vue-iconsax";

const { t } = useI18n();


const props = defineProps({
    data: {
        type: Array,
        default: () => [
            {
                id: 1,
                date: "2023-10-01",
                warehouse: "Main Warehouse",
                transactiontype: "Purchase",
                transactionNumber: "TRX-1001",
                quantity: 50,
                balance: 150,
                active: 'available',
                unitCost: "$20",
            },
            {
                id: 1,
                date: "2023-10-01",
                warehouse: "Main Warehouse",
                transactiontype: "Purchase",
                transactionNumber: "TRX-1001",
                quantity: 50,
                balance: 150,
                active: 'on hold',
                unitCost: "$20",
            },
        ],
    },
});

const columns = computed(() => {
    const Columns = [
        { field: 'warehouse', header: t('warehouses.title'), type: 'slot' },
        { field: 'transactiontype', header: t('itemList.zone/Location'), type: 'slot', },
        { field: 'transactionNumber', header: t('itemList.onHand') },
        { field: 'quantity', header: t('itemList.onHold') },
        { field: 'balance', header: t('itemList.available') },
    ];

    return Columns;
});

const secondColumns = computed(() => {
    const Columns = [
        { field: 'unitCost', header: t('itemList.serialNumber') },
        { field: 'warehouse', header: t('warehouses.title'), type: 'slot' },
        { field: 'transactionNumber', header: t('itemList.zone') },
        { field: 'quantity', header: t('itemList.quantity') },
        {field : 'active', header: t('status'), type: 'slot'},
        { field: 'transactiontype', header: t('itemList.transactiontype'), type: 'slot', },
        { field: 'balance', header: t('itemList.lastTransaction') },
    ];

    return Columns;
});
</script>

<template>
    <h1 class="text-lg font-semibold text-gray-500 p-4">{{ $t("itemList.stockByWarehouse") }}</h1>
    <DynamicTable :columns="columns" :data="data" :paginator="false"/>
    <span class="text-lg font-semibold text-gray-500 p-4 flex gap-2">
        <VsxIcon iconName="Tag2" :size="24" type="linear" style="color: #638EFF" />
        {{ $t("itemList.bySerialNumbers") }}
    </span>
    <DynamicTable :columns="secondColumns" :data="data" :paginator="false">
         <!-- <template #cell-active="{ data }"> -->
            <template v-slot:["active"]="{ data }">
  <Tag
  :value="data.active"
  :severity="data.active === 'available' ? 'success' : 'warning'"
/>
  </template>
        </DynamicTable>

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