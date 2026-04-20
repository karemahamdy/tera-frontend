<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  routings: any[];
}>();

const columns = computed(() => [
  { field: 'sequence',      header: t('BOM.Seq'),          sortable: false },
  { field: 'operationName', header: t('BOM.Process'),       sortable: false },
  { field: 'machineName',   header: t('BOM.Machine'),       sortable: false },
  { field: 'runTime',       header: t('BOM.RunTime'),       sortable: false },
  { field: 'setupTime',     header: t('BOM.SetupTime'),     sortable: false },
  { field: '',     header: t('BOM.MachineCost'),     sortable: false },
  { field: '',     header: t('BOM.LaborCost'),     sortable: false },
  { field: 'overheadCost',  header: t('BOM.OverheadCost'),  sortable: false },
]);
const formattedRoutings = computed(() => {
  return props.routings.map(item => ({
    ...item,
    totalCost: item.totalCost != null ? Number(item.totalCost).toFixed(2) : '0.00',
    overheadCost: item.overheadCost != null ? Number(item.overheadCost).toFixed(2) : '0.00',
  }));
});
</script>

<template>
  <div>
    <DynamicTable :columns="columns" :data="formattedRoutings" :paginator="false" lazy />
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