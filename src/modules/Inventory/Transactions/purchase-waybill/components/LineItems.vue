<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ItemSelectionDialog from '@/modules/Inventory/shared/components/ItemSelectionDialog.vue';
import QuantitySerialDialog from '@/modules/Inventory/shared/components/QuantitySerialDialog.vue';
import { useInventoryLookups } from '@/composables/useInventoryLookups';
import type { LineItem } from '../types/PurchaseWaybill';

const props = withDefaults(defineProps<{
  lineItems?: LineItem[] | null;
  disabled?: boolean;
}>(), {
  lineItems: null,
  disabled: false,
});

const { t } = useI18n();
const emit = defineEmits(['next', 'prev', 'update']);

// --- State ---
const items = ref<any[]>([]);

const { getItemsLookups, itemsLookups, getUnitsLookups, UnitsLookups } = useInventoryLookups();

const unitOptionsMap = ref<Record<number | string, any[]>>({});

function mapApiItem(item: LineItem) {
  unitOptionsMap.value[item.id] = [{ label: item.unitName, value: item.unitName, unitId: item.unitId, conversionFactor: 1 }];

  return {
    id: item.id,
    lineNumber: item.lineNumber,
    itemId: item.itemId,
    code: item.itemId,
    name: item.itemName,
    quantity: item.quantity,
    uom: item.unitName,
    unitId: item.unitId,
    barcode: '',
    itemType: '',
    warehouse: item.warehouseName,
    warehouseId: item.warehouseId,
    zone: item.zoneName ?? '',
    zoneId: item.zoneId ?? null,
    unitPrice: Number(item.unitPrice) || 0,
    tax: Number(item.unitTaxPercent) || 0,
    total: item.lineTotal,
    serials: (item.serials ?? []).map((s: any) => ({
      id: s.id,
      serial: s.mainSerial,
      qty: s.quantity,
      batch: s.batchNumber,
      expire: s.expireDate
    })),
    isBlocked: item.isBlocked,
    tracked: (item.serials && item.serials.length > 0) || item.quantity > 0,
  };
}

// Sync from props when editing an existing record (only once on first load)
watch(() => props.lineItems, (newItems) => {
  if (newItems && newItems.length > 0 && items.value.length === 0) {
    items.value = newItems.map(mapApiItem);
  }
}, { immediate: true });

// Emit items to parent on any change
watch(items, (newVal) => {
  emit('update', newVal);
}, { deep: true });

// NaN-safe total recalculation — runs whenever quantity/price/tax changes
watch(items, (newVal) => {
  newVal.forEach(item => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const taxPercent = Number(item.tax) || 0;
    const sub = qty * price;
    const calculatedTotal = sub + (sub * taxPercent) / 100;
    if (!isNaN(calculatedTotal) && Math.abs((item.total || 0) - calculatedTotal) > 0.001) {
      item.total = calculatedTotal;
    }
  });
}, { deep: true });

const subtotal = computed(() => items.value.reduce((sum: number, item: any) => sum + item.total, 0));

onMounted(async () => {
  await getUnitsLookups();
});

const columns = computed(() => [
  { field: 'code', header: t('itemsList.itemCode') },
  { field: 'name', header: t('itemsList.itemName') },
  { field: 'quantity', header: t('itemsList.quantity') },
  { field: 'uom', header: t('itemsList.uom') },
  { field: 'warehouse', header: t('itemsList.warehouse') },
  { field: 'zone', header: t('itemsList.zone') },
  { field: 'unitPrice', header: t('itemsList.unitPrice') },
  { field: 'tax', header: t('itemsList.tax') },
  { field: 'total', header: t('itemsList.total') },
  ...(props.disabled ? [] : [{ field: 'action', header: '' }])
]);

const showItemDialog = ref(false);
const availableItems = computed(() => itemsLookups.value.map(item => ({
  ...item,
  label: item.name,
  value: item.id
})));

const openItemDialog = async () => {
  await getItemsLookups(false);
  showItemDialog.value = true;
};

const handleSelectItem = (selectedItem: any) => {
  // Close dialog immediately to ensure smooth UX
  showItemDialog.value = false;

  const originalItem = itemsLookups.value.find(i => i.id === selectedItem.id);
  const units = originalItem?.units || selectedItem.units || [];
  const baseUnit = units.find((u: any) => u.isBaseUnit);
  const rowId = Date.now();

  unitOptionsMap.value[rowId] = units.map((u: any) => ({
    label: u.unitCode ? `${u.unitName} (${u.unitCode})` : u.unitName,
    value: u.unitName,
    unitId: u.unitId,
    conversionFactor: u.conversionFactor
  }));

  const newItem = {
    id: rowId,
    itemId: selectedItem.id,
    code: selectedItem.code,
    name: selectedItem.name,
    barcode: selectedItem.barcode || '',
    itemType: selectedItem.itemType || '',
    quantity: 1,
    uom: baseUnit ? baseUnit.unitName : (selectedItem.baseUnitName || ''),
    unitId: baseUnit ? baseUnit.unitId : (selectedItem.baseUnitId || ''),
    warehouse: '',
    warehouseId: '',
    zone: '',
    zoneId: null,
    unitPrice: 0,
    tax: 0,
    total: 0,
    serials: [],
    tracked: (originalItem?.trackingType || selectedItem.trackingType) !== 'None'
  };

  // Calculate initial total
  const qty = Number(newItem.quantity) || 0;
  const price = Number(newItem.unitPrice) || 0;
  const taxPercent = Number(newItem.tax) || 0;
  const sub = qty * price;
  newItem.total = sub + (sub * taxPercent) / 100;

  items.value.push(newItem);
};

const showQtyDialog = ref(false);
const currentItem = ref<any>(null);

const openQtyDialog = (item: any) => {
  currentItem.value = item;
  showQtyDialog.value = true;
};

const handleSaveSerials = (payload: any) => {
  showQtyDialog.value = false;
  if (currentItem.value) {
    currentItem.value.serials = payload.serials;
    currentItem.value.quantity = payload.totalQty;
    
    // Recalculate total for this item
    const price = Number(currentItem.value.unitPrice) || 0;
    const taxPercent = Number(currentItem.value.tax) || 0;
    const sub = payload.totalQty * price;
    currentItem.value.total = sub + (sub * taxPercent) / 100;
  }
};

const removeItem = (data: any) => {
  const index = items.value.findIndex(item => item.id === data.id);
  if (index !== -1) {
    items.value.splice(index, 1);
    delete unitOptionsMap.value[data.id];
  }
};

</script>

<template>
  <div class="flex flex-col h-full bg-white rounded-xl">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ t('itemsList.title') }}</h2>
        <p class="text-gray-500 text-sm">
          {{ t('itemsList.description') }}
        </p>
      </div>
      <BaseButton v-if="!disabled" :label="t('itemsList.addItem')"
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
              <VsxIcon iconName="Airdrop" :size="20" type="linear" />
            </Badge>
            <Badge v-else severity="transparent" class="circle-badge">
              <VsxIcon iconName="Airdrop" :size="20" type="linear" class="icon-transparent" />
            </Badge>
            <div class="text-base text-gray-700">{{ data.code }}</div>
          </div>
        </template>

        <template #col-barcode="{ data }">
          <span class="text-gray-600">{{ data.barcode || '—' }}</span>
        </template>

        <template #col-itemType="{ data }">
          <Badge :severity="data.itemType === 'FinalProduct' ? 'success' : 'info'" class="text-xs">
            {{ data.itemType }}
          </Badge>
        </template>

        <template #col-quantity="{ data }">
          <div class="flex items-center gap-2">
            <template v-if="data.tracked">
              <BaseButton :label="disabled ? t('button.view') : t('itemsList.add')" variant="outline-primary"
                @click="openQtyDialog(data)" />
              <span class="text-gray-500">({{ data.quantity }})</span>
            </template>
            <template v-else>
              <InputText v-model.number="data.quantity" class="w-20 p-inputtext-sm" />
            </template>
          </div>
        </template>

        <template #col-uom="{ data }">
          <span v-if="disabled || !unitOptionsMap[data.id] || unitOptionsMap[data.id].length <= 1"
            class="text-gray-700">{{ data.uom }}</span>
          <select v-else v-model="data.uom"
            class="w-24 p-1 text-sm border border-gray-200 rounded bg-gray-50 focus:border-primary-500 focus:outline-none"
            @change="() => {
              const opt = (unitOptionsMap[data.id] || []).find((o: any) => o.value === data.uom);
              if (opt) data.unitId = opt.unitId;
            }">
            <option v-for="opt in unitOptionsMap[data.id]" :key="opt.unitId" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </template>

        <template #col-warehouse="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.warehouse }}</span>
          <select v-else v-model="data.warehouse"
            class="w-24 p-1 text-sm border border-gray-200 rounded bg-gray-50 focus:border-primary-500 focus:outline-none">
            <option value="">{{ t('items.warehouse') }}</option>
            <option value="WH-011">WH-011</option>
            <option value="WH-012">WH-012</option>
          </select>
        </template>

        <template #col-zone="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.zone || '—' }}</span>
          <select v-else v-model="data.zone"
            class="w-24 p-1 text-sm border border-gray-200 rounded bg-gray-50 focus:border-primary-500 focus:outline-none">
            <option value="">{{ t('items.zone') }}</option>
            <option value="Zone A">Zone A</option>
            <option value="Zone B">Zone B</option>
          </select>
        </template>

        <template #col-unitPrice="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.unitPrice }}</span>
          <InputText v-else :value="data.unitPrice"
            @input="(e: any) => { const v = parseFloat(e.target.value); data.unitPrice = isNaN(v) ? 0 : v; }"
            class="w-20 p-inputtext-sm" />
        </template>

        <template #col-tax="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.tax }}%</span>
          <InputText v-else :value="data.tax"
            @input="(e: any) => { const v = parseFloat(e.target.value); data.tax = isNaN(v) ? 0 : v; }"
            class="w-16 p-inputtext-sm" />
        </template>

        <template #col-total="{ data }">
          <span class="font-medium text-gray-900">{{ Number(data.total).toFixed(2) }}</span>
        </template>

        <template #col-action="{ data }">
          <button v-if="!disabled" class="text-red-400 hover:text-red-600" @click="removeItem(data)">
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

    <ItemSelectionDialog v-if="showItemDialog" v-model:visible="showItemDialog" :items="availableItems" @select="handleSelectItem" />

    <QuantitySerialDialog v-if="showQtyDialog && currentItem" v-model:visible="showQtyDialog" :item="currentItem"
      :initialSerials="currentItem.serials" :disabled="disabled" @save="handleSaveSerials" />
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
