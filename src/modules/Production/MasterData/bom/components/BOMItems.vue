<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const data = ref([
    { id: 1, code: 'WC001', name: 'Work Center 1', department: 50, BOM: "3 BOM", isActive: true },
    { id: 2, code: 'WC002', name: 'Work Center 2', department: 90, BOM: "3 BOM", isActive: false },
    { id: 3, code: 'WC003', name: 'Work Center 3', department: 40, BOM: "8 BOM", isActive: true },
]);

const columns = computed(() => {
    const Columns = [
        { field: 'code', header: t('BOM.code'), sortable: false },
        { field: 'name', header: t('BOM.name'), type: 'slot', sortable: false },
        { field: 'BOM', header: t('BOM.uom'), type: 'slot', sortable: false },
        { field: 'department', header: t('BOM.quantity'), type: 'slot', sortable: false },
        { field: 'department', header: t('BOM.unitcost'), type: 'slot', sortable: false },
        { field: 'department', header: t('BOM.scrap'), type: 'slot', sortable: false },
        { field: 'department', header: t('BOM.TotalCost'), type: 'slot', sortable: false },
    ];

    return Columns;
});


</script>

<template>
    <div class="">
                <DynamicTable :columns="columns" :data="data" :paginator="false" lazy>
                    
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