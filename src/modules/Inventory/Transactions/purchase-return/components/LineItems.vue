<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ItemSelectionDialog from '@/modules/Inventory/shared/components/ItemSelectionDialog.vue';
import SalesQuantitySerialDialog from '@/modules/Inventory/shared/components/SalesQuantitySerialDialog.vue';

const { t } = useI18n();
const emit = defineEmits(['next', 'prev']);

// --- State ---
const items = ref([
    {
        id: 1,
        code: 'ITM-001',
        name: 'Hydraulic Pump',
        quantity: 0,
        uom: 'PCS',
        warehouse: 'WH-011',
        zone: 'Zone A',
        unitPrice: "450",
        tax: "5",
        total: 450.00,
        serials: []
    },
    {
        id: 2,
        code: 'ITM-045',
        name: 'Industrial 6205',
        quantity: 0,
        uom: 'PCS',
        warehouse: 'WH-011',
        zone: 'Zone A',
        unitPrice: "85",
        tax: "11",
        total: 85.00,
        serials: []
    },
    {
        id: 3,
        code: 'ITM-045',
        name: 'Steel 10mm',
        quantity: 3,
        uom: 'PCS',
        warehouse: 'WH-011',
        zone: 'Zone A',
        unitPrice: "70",
        tax: "5",
        total: 85.00,
        serials: []
    }
]);

// --- Computed ---
const subtotal = computed(() => items.value.reduce((sum: number, item: any) => sum + item.total, 0));

const columns = computed(() => [
    { field: 'code', header: t('itemsList.itemCode') },
    { field: 'name', header: t('itemsList.itemName') },
    { field: 'Waybill', header: t('ReturnItems.Waybill') },
    { field: 'uom', header: t('itemsList.uom') },
    { field: 'Purchased', header: t('purchaseReturn.Purchased') },
    { field: 'ReturnQTY', header: t('ReturnItems.ReturnQTY') },
    { field: 'warehouse', header: t('ReturnItems.warehouse') },
    { field: 'zone', header: t('itemsList.zone') },
    { field: 'Balance', header: t('purchaseReturn.Balance') },
    { field: 'action', header: '' }
]);

// --- Item Selection Dialog ---
const showItemDialog = ref(false);
const availableItems = ref([
    { code: 'ITM-001', name: 'Hydraulic Pump Model A', unit: 'PCS' },
    { code: 'ITM-045', name: 'Industrial Bearing 6205', unit: 'PCS' },
    { code: 'ITM-269', name: 'Steel Plate 10mm', unit: 'SHT' },
    { code: 'ITM-156', name: 'Lubricant Oil SAE 40', unit: 'LTR' },
    { code: 'ITM-001', name: 'Hydraulic Pump Model A', unit: 'PCS', tracked: true },
]);

const openItemDialog = () => {
    showItemDialog.value = true;
};

const handleSelectItem = (item: any) => {
    items.value.push({
        id: Date.now(),
        code: item.code,
        name: item.name,
        quantity: 0,
        uom: item.unit,
        warehouse: '',
        zone: '',
        unitPrice: "0",
        tax: "0",
        total: 0,
        serials: []
    });
};

// --- Quantity/Serial Dialog ---
const showQtyDialog = ref(false);
const currentItem = ref<any>(null);

const openQtyDialog = (item: any) => {
    currentItem.value = item;
    showQtyDialog.value = true;
};

const handleSaveSerials = (payload: any) => {
    if (currentItem.value) {
        currentItem.value.serials = payload.serials;
        currentItem.value.quantity = payload.totalQty;
    }
};

const removeItem = (data: any) => {
    const index = items.value.findIndex(item => item.id === data.id);
    if (index !== -1) {
        items.value.splice(index, 1);
    }
};
</script>

<template>
    <div class="flex flex-col h-full bg-white rounded-xl ">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-xl font-bold text-gray-900">{{ t('ReturnItems.title') }}</h2>
                <p class="text-gray-500 text-sm">
                    {{ t('ReturnItems.description') }}
                </p>
            </div>
            <BaseButton :label="t('itemsList.addItem')" icon="pi pi-plus"
                class="bg-primary-600 border-none hover:bg-primary-700 font-semibold px-4 py-2 rounded-lg"
                @click="openItemDialog" />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <DynamicTable :columns="columns" :data="items" :paginator="false" :showView="false" :showEdit="false"
                :showDelete="false">
                <template #col-code="{ data }">
                    <div class="flex items-center gap-2 rounded">
                        <Badge v-if="!data.tracked" severity="success" class="circle-badge-sm">
                            <VsxIcon iconName="Brodcast" :size="20" type="linear" />
                        </Badge>
                        <Badge v-else severity="transparent" class="circle-badge">
                            <VsxIcon iconName="Brodcast" :size="20" type="linear" class="icon-transparent" />
                        </Badge>
                        <div class="text-base text-gray-700">{{ data.code }}</div>
                    </div>
                </template>

                <template #col-name="{ data }">
                    <span class="text-gray-600">{{ data.name }}</span>
                </template>

                <template #col-ReturnQTY="{ data }">
                    <div class="flex items-center gap-2">
                        <BaseButton :label="t('itemsList.add')" variant="outline-primary"
                            @click="openQtyDialog(data)" />
                        <span class="text-gray-500">({{ data.ReturnQTY }})</span>
                    </div>
                </template>

                <template #col-uom="{ data }">
                    <FormDropdown v-model="data.uom" :options="['PCS', 'KG', 'LTR']" class="w-20 p-inputtext-sm text-sm" />
                </template>

                <template #col-warehouse="{ data }">
                    <FormDropdown v-model="data.warehouse" :options="['WH-011', 'WH-012']" class="w-24 p-inputtext-sm text-sm"
                        :placeholder="t('items.warehouse')" />
                </template>

                <template #col-zone="{ data }">
                    <FormDropdown v-model="data.zone" :options="['Zone A', 'Zone B']" class="w-24 p-inputtext-sm text-sm"
                        :placeholder="t('items.zone')" />
                </template>

                <template #col-unitPrice="{ data }">
                    <InputText v-model.number="data.unitPrice" class="w-20 p-inputtext-sm" />
                </template>

                <template #col-tax="{ data }">
                    <InputText v-model.number="data.tax" class="w-16 p-inputtext-sm" prefix="%" />
                </template>

                <template #col-total="{ data }">
                    <span class="font-medium text-gray-900">{{ data.total.toFixed(2) }}</span>
                </template>

                <template #col-action="{ data }">
                    <button class="text-red-400 hover:text-red-600" @click="removeItem(data)">
                        <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
                    </button>
                </template>
            </DynamicTable>
        </div>

        <!-- Subtotal Footer -->
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <span class="text-gray-600 font-medium">
                {{ t('itemsList.subtotal') }} ({{ items.length }} {{ t('itemsList.items') }})
            </span>
            <span class="text-xl font-bold text-primary-600">
                ${{ subtotal.toFixed(2) }}
            </span>
        </div>

        <ItemSelectionDialog v-model:visible="showItemDialog" :items="availableItems" @select="handleSelectItem" />

        <SalesQuantitySerialDialog v-if="currentItem" v-model:visible="showQtyDialog" :item="currentItem"
            :initialSerials="currentItem.serials" @save="handleSaveSerials" />

    </div>
</template>

<style scoped>
/* Custom Table Styles override if needed, using tailwind classes mostly */
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
