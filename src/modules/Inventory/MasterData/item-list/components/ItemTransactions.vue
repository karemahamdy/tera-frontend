<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

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
                unitCost: "$20", 
            },
        ],
    },
});

const columns = computed(() => {
    const Columns = [
        { field: 'date', header: t('itemList.date') },
        { field: 'warehouse', header: t('warehouses.title'), type: 'slot' },
        { field: 'transactiontype', header: t('itemList.transactiontype'), type: 'slot', Class: 'custom-badge' },
        { field: 'transactionNumber', header: t('itemList.transactionNumber') },
        { field: 'quantity', header: t('itemList.quantity') },
        { field: 'balance', header: t('itemList.balance') },
        { field: 'unitCost', header: t('itemList.unitCost') },
    ];

    return Columns;
});
</script>

<template>
            <h1 class="text-lg font-bold text-[#717680] p-4">{{ $t("itemList.recentTransactions") }}</h1>  
                <DynamicTable :columns="columns" :data="data" />         
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