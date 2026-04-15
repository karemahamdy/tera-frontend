<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  materials: any[];
}>();

const columns = computed(() => [
  { field: 'componentItemCode', header: t('BOM.code'), sortable: false },
  { field: 'componentItemName', header: t('BOM.name'), sortable: false },
  { field: 'uomName', header: t('BOM.uom'), sortable: false },
  { field: 'quantity', header: t('BOM.quantity'), sortable: false },
  { field: 'unitCost', header: t('BOM.unitcost'), sortable: false },
  { field: 'scrapPercentage', header: t('BOM.scrap'), sortable: false },
  { field: 'totalCost', header: t('BOM.TotalCost'), sortable: false },
]);

const totalMaterialCost = computed(() => {
  return props.materials.reduce((sum, item) => {
    const cost = Number(item.totalCost) || 0;
    return sum + cost;
  }, 0).toFixed(2);
});
</script>

<template>
  <div>
    <DynamicTable :columns="columns" :data="materials" :paginator="false" lazy />
    
     <div class="bg-[#EEF2FF] px-4 py-3 rounded-lg text-sm text-[#6366F1] flex justify-between mt-4">
            <span class="text-[#717680] text-center pt-3 text-[18px]">{{ t('BOM.TotalMaterialCost') }}</span>
            <span class="text-[#414651] text-[24px] font-bold">${{ totalMaterialCost }}</span>
               
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
</style>