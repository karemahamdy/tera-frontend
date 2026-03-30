<script setup lang="ts">
import ItemSelectionDialog from '@/modules/Inventory/shared/components/ItemSelectionDialog.vue';
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoryLookups } from "@/composables/useInventoryLookups";

const { t } = useI18n();
const { getItemsLookups, itemsLookups } = useInventoryLookups();

const props = defineProps<{
    lineItems?: any[];
    disabled?: boolean;
}>();

const emit = defineEmits(['next', 'prev', 'update']);

const items = ref<any[]>([]);

onMounted(async () => {
    await Promise.all([
        getItemsLookups(),
    ]);
});

function emitUpdate() {
    emit('update', [...items.value]);
}

const columns = computed(() => [
    { field: 'code', header: t('itemList.itemCode') },
    { field: 'name', header: t('itemList.itemName') },
    { field: 'quantity', header: t('itemList.quantity') },
    { field: 'unitId', header: t('itemList.UOM') },
    { field: 'quantity', header: t('BOM.scrap') },
    // ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);


// const removeItem = (data: any) => {
//     if (props.disabled) return;
//     const index = items.value.findIndex(item => item.id === data.id);
//     if (index !== -1) {
//         items.value.splice(index, 1);
//     }
//     emitUpdate();
// };

</script>

<template>
    <div class="flex flex-col h-full bg-white rounded-xl ">
  
        <!-- Table -->
        <div class="overflow-x-auto">
            <DynamicTable :columns="columns" :data="items" :paginator="false" :showView="false" :showEdit="false"
                :showDelete="false">
                <template #col-code="{ data }">
                    <div class="flex items-center gap-2 rounded">
                        <Badge v-if="data.trackingType === 'Serial'" severity="success" class="circle-badge-sm">
                            <VsxIcon iconName="Brodcast" :size="20" type="linear" />
                        </Badge>
                        <Badge v-else severity="transparent" class="circle-badge">
                            <VsxIcon iconName="Brodcast" :size="20" type="linear" class="icon-transparent" />
                        </Badge>
                        <div class="text-base text-gray-700">{{ data.code }}</div>
                    </div>
               </template>
            </DynamicTable>
        </div>
     

    </div>
</template>

<style scoped>
:deep(.p-select) {
    border-color: #f3f4f6;
    background-color: #f9fafb;
}

:deep(.p-inputtext) {
    border-color: #e5e7eb;
    background-color: #f9fafb;
}

:deep(.p-inputtext:focus) {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb;
}

.circle-badge-sm {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
}

.circle-badge {
    background-color: transparent;
}

.icon-transparent {
    color: transparent;
}
</style>
