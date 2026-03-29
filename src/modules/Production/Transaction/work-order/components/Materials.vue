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
    ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);

// --- Item Selection Dialog ---
const showItemDialog = ref(false);
const availableItems = computed(() => itemsLookups.value);

const openItemDialog = () => {
    if (!props.disabled) showItemDialog.value = true;
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

</script>

<template>
    <div class="flex flex-col h-full bg-white rounded-xl ">
        <!-- Header -->
        <div class="flex justify-between items-center mb-3">
            <div>
                <h2 class="text-xl font-bold text-gray-900">{{ t('workOrder.BOMMaterials') }}</h2>
            </div>
            <BaseButton v-if="!disabled" :label="t('workOrder.addItem')" icon="AddSquare"
                class="bg-primary-600 border-none hover:bg-primary-700 font-semibold px-4 py-2 rounded-lg"
                @click="openItemDialog" />
        </div>
        <div class="grid grid-cols-3 gap-16 p-4">
            <div class="flex flex-col gap-2">
                <span class="text-lg text-[#A4A7AE]">{{ $t('BOM.code') }}</span>
                <span class="text-[#101828] text-base font-medium">MC-CNC-001</span>
            </div>
            <div class="flex flex-col gap-2">
                <span class="text-lg text-[#A4A7AE]">{{ $t('BOM.name') }}</span>
                <div class="flex items-center gap-2">
                    <span class="text-[#101828] text-base font-medium">CNC Milling </span>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <span class="text-lg text-[#A4A7AE]">{{ $t('BOM.BomVersion') }}</span>
                <div class="flex items-center gap-2">
                    <span class="text-[#101828] text-base font-medium">5454</span>
                </div>
            </div>
        </div>
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
                            <InputText  v-model.number="data.quantity" class="w-20 p-inputtext-sm" />
                    </div>
                </template>
                <template #col-unitId="{ data }">
                    <FormDropdown :modelValue="data.unitId" optionLabel="label" optionValue="value"
                        class="w-34 p-inputtext-sm text-sm" />
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
