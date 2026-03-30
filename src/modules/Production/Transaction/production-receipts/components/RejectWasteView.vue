<script setup lang="ts">
import ItemSelectionDialog from '@/modules/Inventory/shared/components/ItemSelectionDialog.vue';
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import QuantitySerialDialog from '@/modules/Inventory/shared/components/QuantitySerialDialog.vue';

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
    { field: 'type', header: t('itemList.type') },
    { field: 'quantity', header: t('itemList.quantity') },
    { field: 'warehouse', header: t('itemList.warehouse') },
    { field: 'zone', header: t('itemList.zone') },
    { field: 'zone', header: t('ProductionReceipts.relartedProcess') },
    { field: 'reason', header: t('ProductionReceipts.reason') },
    ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);

// --- Item Selection Dialog ---
const showItemDialog = ref(false);
const availableItems = computed(() => itemsLookups.value);

// --- Quantity/Serial Dialog ---
const showQtyDialog = ref(false);
const currentItem = ref<any>(null);

const openQtyDialog = (item: any) => {
    currentItem.value = item;
    showQtyDialog.value = true;
};

const handleSelectItem = (item: any) => {
    items.value.push({
        itemId: item.id || item.itemId,
        trackingType: item.trackingType || null,
        code: item.code,
        name: item.name,
        quantity: 1,
        uom: item.baseUnitName || 'PCS',
    });
    emitUpdate();
};

const removeItem = (data: any) => {
    if (props.disabled) return;
    const index = items.value.findIndex(item => item.id === data.id);
    if (index !== -1) {
        items.value.splice(index, 1);
    }
    emitUpdate();
};
const handleSaveSerials = (payload: any) => {
    if (currentItem.value) {
        currentItem.value.serials = payload.serials;
        currentItem.value.quantity = payload.totalQty;
    }
    emitUpdate();
};

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
                <template #col-quantity="{ data }">
                    <div class="flex items-center gap-2">
                        <!-- Show button when: serial-tracked (create/edit) OR has serials (view) -->
                        <template v-if="data.trackingType === 'Serial' || (disabled && data.serials?.length > 0)">
                            <BaseButton :label="disabled ? t('button.view') : t('itemsList.add')"
                                variant="outline-primary" @click="openQtyDialog(data)" />
                            <span class="text-gray-500">({{ data.quantity }})</span>
                        </template>
                        <template v-else>
                            <InputText v-if="!disabled" v-model.number="data.quantity" class="w-20 p-inputtext-sm" />
                            <span v-else class="text-gray-700">
                                {{ data.quantity }}
                            </span>
                        </template>
                    </div>
                </template>
                <template #col-type="{ data }">
                    <FormDropdown :modelValue="data.type" optionLabel="label" optionValue="value"
                        class="w-34 p-inputtext-sm text-sm" />
                </template>
                <template #col-zone="{ data }">
                    <FormDropdown :modelValue="data.zone" optionLabel="label" optionValue="value"
                        class="w-34 p-inputtext-sm text-sm" />
                </template>
                <template #col-warehouse="{ data }">
                    <FormDropdown :modelValue="data.warehouse" optionLabel="label" optionValue="value"
                        class="w-34 p-inputtext-sm text-sm" />
                </template>
                <template #col-reason="{ data }">
                    <div class="flex items-center gap-2">
                        <InputText v-model.number="data.reason" class="w-20 p-inputtext-sm" />
                    </div>
                </template>
                <template #col-name="{ data }">
                    <span class="text-gray-600">{{ data.name }}</span>
                </template>
                <template #col-action="{ data }">
                    <button v-if="!disabled" class="text-red-400 hover:text-red-600" @click="removeItem(data)">
                        <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
                    </button>
                </template>
            </DynamicTable>
        </div>
        <ItemSelectionDialog v-model:visible="showItemDialog" :items="availableItems" @select="handleSelectItem" />
        <QuantitySerialDialog v-if="currentItem" v-model:visible="showQtyDialog" :item="currentItem"
            :disabled="disabled" @save="handleSaveSerials" />
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
