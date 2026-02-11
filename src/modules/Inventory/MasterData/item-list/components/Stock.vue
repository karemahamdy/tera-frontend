<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import type VsxIcon from "vue-iconsax";
import { useItem } from "../composables/useItem";
import type { WarehouseStock, LastTransaction } from "../types/itemList";

const { t } = useI18n();
const route = useRoute();
const { fetchItemStock } = useItem();

const warehouseStock = ref<WarehouseStock[]>([]);
const lastTransactions = ref<LastTransaction[]>([]);
const loading = ref(false);

const id = route.params.id as string;

onMounted(async () => {
  if (id) {
    loading.value = true;
    const response = await fetchItemStock(id);
    if (response) {
        console.log(response);
        
        warehouseStock.value = response.warehouseStockDto || [];
        lastTransactions.value = (response.lastTransactionsDto || []).map((item: any) => ({
            ...item,
            warehouseCode: item.warehauseCode || item.warehouseCode
        }));
    }
    loading.value = false;

  }
});

const warehouseColumns = computed(() => {
    return [
        { field: 'warehouseCode', header: t('warehouses.title') },
        { field: 'zoneLocation', header: t('itemList.zone/Location') },
        { field: 'onHandQuantity', header: t('itemList.onHand') },
        { field: 'holdQuantity', header: t('itemList.onHold') },
        { field: 'availableQuantity', header: t('itemList.available') },
    ];
});

const transactionColumns = computed(() => {
    return [
        { field: 'serialNumber', header: t('itemList.serialNumber') },
        { field: 'warehouseCode', header: t('warehouses.title') },
        { field: 'zoneCode', header: t('itemList.zone') },
        { field: 'quantity', header: t('itemList.quantity') },
        { field: 'status', header: t('status'), type: 'slot' },
        { field: 'transactionType', header: t('itemList.transactiontype') },
        { field: 'lastTransactionCode', header: t('itemList.lastTransaction') },
    ];
});
</script>

<template>
    <div v-if="!loading">
        <h1 class="text-lg font-semibold text-gray-500 p-4">{{ $t("itemList.stockByWarehouse") }}</h1>
        <DynamicTable :columns="warehouseColumns" :data="warehouseStock" :paginator="false">
              <template v-slot:["col-holdQuantity"]="{ data }">
                         <span class="text-warning-500">
                            {{ data.holdQuantity }}
                         </span>
                        </template>
                        <template v-slot:["col-availableQuantity"]="{ data }">
                         <span class="text-success-500">
                            {{ data.availableQuantity }}
                         </span>
                        </template>
        </DynamicTable>
        
        <span class="text-lg font-semibold text-gray-500 p-4 flex gap-2 mt-4">
            <VsxIcon iconName="Tag2" :size="24" type="linear" style="color: #638EFF" />
            {{ $t("itemList.bySerialNumbers") }}
        </span>
        <DynamicTable :columns="transactionColumns" :data="lastTransactions" :paginator="false">
               <template  v-slot:["col-status"]="{ data }">
                        <div v-if="data.status === 'On Hold'" class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-warning-50 text-warning-500">
                            <span>{{ data.status }}</span>
                        </div>
                        <div v-else-if="data.status === 'Avalable'" class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-success-50 text-success-500">
                           
                            <span>{{ data.status }}</span>
                        </div>
                        
                    </template>
                    <template  v-slot:["col-lastTransactionCode"]="{ data }">
                        <span class="text-primary-500 cursor-pointer underline">{{ data.lastTransactionCode }}</span>
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
</style>