<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { formatDate } from "@/app/utils/dates";

const { t } = useI18n();

import { usePhysicalCountForm } from "../composables/usePhysicalCountForm";
const { countDate, notes, physicalCountLines } = usePhysicalCountForm();


const columns = computed(() => {
    const Columns = [
        { field: 'itemCode', header: t('PhysicalCount.ItemCode') },
        { field: 'descrption', header: t('PhysicalCount.Descrption') },
        { field: 'systemBalance', header: t('PhysicalCount.SystemBalance') },
        { field: 'countedQTY', header: t('PhysicalCount.CountedQTY') },
        { field: 'variances', header: t('PhysicalCount.Variances') },
    ];
    return Columns;
});
</script>

<template>
    <div>
        <PageHeader title="PhysicalCount.ReviewOpeningBalance" :showSearch="false" />
        <div class="grid grid-cols-2 justify-between">
            <div class="mb-5">
                <p class="text-gray-500">{{ $t("PhysicalCount.date") }}</p>
                <p>{{ formatDate(countDate as Date) }}</p>
            </div>
            <div class="mb-5">
                <p class="text-gray-500">{{ $t("itemTransaction.notes") }}</p>
                <p>{{ notes }}</p>-
            </div>
        </div>
        <div>
            <p><strong>{{ $t("PhysicalCount.LineItems") }}</strong></p>
            <DynamicTable :columns="columns" :data="physicalCountLines" :paginator="false">
                <template v-slot:["col-variances"]="{ data }">
                    <span class="text-danger-500">{{ data.variances }}</span>
                </template>
            </DynamicTable>
        </div>
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