<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useItemHoldSerial } from "../composables/useItemHoldSerial";
import { useItemHold } from "../composables/useItemHold";
import alertIcon from "@/assets/images/alert.png";
import type { ItemHoldTransaction } from "../types/ItemHold";
 
const { t } = useI18n();

const isVisible = ref<boolean>(false)
const showReleaseDialog = ref(false);
const selectedItem = ref<ItemHoldTransaction | null>(null);
const rowToRelease = ref<any | null>(null);
const confirmationTitle = computed(() => {
    return t('itemHold.releaseSerialConfirm');
});


const { apiHoldingSerials, loading, pageIndex, pageSize, totalCount, onSort, fetchHoldingSerials, setPage, releaseSerial } = useItemHoldSerial();
const { fetchItemHoldLastPage } = useItemHold();
const serialsColumns = computed(() => {
  const Columns = [
    { field: 'mainSerial', header: t('operation.serial') },
    { field: 'quantity', header: t('serial.qty') },
    { field: 'batch', header: t('serial.batch') },
    { field: 'expiryDate', header: t('serial.expire'), type: "date" },
    { field: 'serial2And3', header: t('serial.serial23') },
    { field: 'comment', header: t('serial.comment') },
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

const handleReleaseConfirm = async () => {
    showReleaseDialog.value = false;
    await releaseSerial({
        transactionLineId: rowToRelease.value.transactionLineId,
        itemId: rowToRelease.value.itemId,
        mainSerial: rowToRelease.value.mainSerial
    })
    await fetchItemHoldLastPage() 
}

const getSerailDialog = (itemTransaction: ItemHoldTransaction) => {
  selectedItem.value = itemTransaction
  isVisible.value = true;
  fetchHoldingSerials(1, itemTransaction.itemId, itemTransaction.warehouseId)
  
}

defineExpose({
  getSerailDialog
});
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <Dialog v-model:visible="isVisible" modal :style="{ width: '80%' }">
        <div>
            <PageHeader 
              title="PhysicalCount.serialItemSelection" 
              :subtitle="`${selectedItem?.itemName ?? ''} (${selectedItem?.code ?? ''})`" 
              :showSearch="false"                     
            />
            <DynamicTable :columns="serialsColumns" :data="apiHoldingSerials" :loading="loading"
                    @page-change="setPage"
                    @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount" lazy>
            <template v-slot:["col-release"]="{ data }">
                        <div
                            @click="confirmRelease(data)"
                            class="cursor-pointer flex align-items-center justify-center rounded gap-1 p-1 text-sm text-success-500">
                            <VsxIcon iconName="Unlock" type="linear" />
                            <span>{{ $t('operation.release') }}</span>
                        </div>
                    </template>
          </DynamicTable>
        </div>
    </Dialog>
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