<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import ItemSelectionDialog from '@/modules/Inventory/shared/components/ItemSelectionDialog.vue';
import QuantitySerialDialog from '@/modules/Inventory/shared/components/QuantitySerialDialog.vue';
import type { LineItem } from '../types/PurchaseWaybill';

const props = withDefaults(defineProps<{
  lineItems?: LineItem[] | null;
  disabled?: boolean;
}>(), {
  lineItems: null,
  disabled: false,
});

const { t } = useI18n();
const emit = defineEmits(['next', 'prev']);

// --- State ---
const items = ref<any[]>([]);

// Map API line items to table-friendly shape
function mapApiItem(item: LineItem) {
  return {
    id: item.id,
    lineNumber: item.lineNumber,
    itemId: item.itemId,
    code: item.itemId,       // no code field in API — use itemId as fallback
    name: item.itemName,
    quantity: item.quantity,
    uom: item.unitName,
    warehouse: item.warehouseName,
    warehouseId: item.warehouseId,
    zone: item.zoneName ?? '',
    zoneId: item.zoneId ?? null,
    unitPrice: String(item.unitPrice),
    tax: String(item.unitTaxPercent),
    total: item.lineTotal,
    serials: item.serials ?? [],
    isBlocked: item.isBlocked,
  };
}

// Populate table from props
watchEffect(() => {
  if (props.lineItems && props.lineItems.length > 0) {
    items.value = props.lineItems.map(mapApiItem);
  }
});

// --- Computed ---
const subtotal = computed(() => items.value.reduce((sum: number, item: any) => sum + item.total, 0));

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

// --- Item Selection Dialog ---
const showItemDialog = ref(false);
const availableItems = ref([
  { code: 'ITM-001', name: 'Hydraulic Pump Model A', unit: 'PCS' },
  { code: 'ITM-045', name: 'Industrial Bearing 6205', unit: 'PCS' },
  { code: 'ITM-269', name: 'Steel Plate 10mm', unit: 'SHT' },
  { code: 'ITM-156', name: 'Lubricant Oil SAE 40', unit: 'LTR' },
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
  <div class="flex flex-col h-full bg-white rounded-xl">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">{{ t('itemsList.title') }}</h2>
        <p class="text-gray-500 text-sm">
          {{ t('itemsList.description') }}
        </p>
      </div>
      <BaseButton
        v-if="!disabled"
        :label="t('itemsList.addItem')"
        icon="pi pi-plus"
        class="bg-primary-600 border-none hover:bg-primary-700 font-semibold px-4 py-2 rounded-lg"
        @click="openItemDialog"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <DynamicTable :columns="columns" :data="items" :paginator="false" :showView="false" :showEdit="false" :showDelete="false">
        <template #col-code="{ data }">
          <div class="flex items-center gap-2 rounded">
            <Badge v-if="!data.tracked" severity="success" class="circle-badge-sm">
              <VsxIcon iconName="Airdrop" :size="20" type="linear" />
            </Badge>
            <Badge v-else severity="transparent" class="circle-badge">
              <VsxIcon iconName="Airdrop" :size="20" type="linear" class="icon-transparent" />
            </Badge>
            <div class="text-base text-gray-700">{{ data.name }}</div>
          </div>
        </template>

        <template #col-name="{ data }">
          <span class="text-gray-600">{{ data.name }}</span>
        </template>

        <template #col-quantity="{ data }">
          <div class="flex items-center gap-2">
            <BaseButton
              v-if="!disabled"
              :label="t('itemsList.add')"
              variant="outline-primary"
              @click="openQtyDialog(data)"
            />
            <span class="text-gray-500">({{ data.quantity }})</span>
          </div>
        </template>

        <template #col-uom="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.uom }}</span>
          <FormDropdown v-else v-model="data.uom" :options="['PCS', 'KG', 'LTR']" class="w-20 p-inputtext-sm text-sm" />
        </template>

        <template #col-warehouse="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.warehouse }}</span>
          <FormDropdown v-else v-model="data.warehouse" :options="['WH-011', 'WH-012']" class="w-24 p-inputtext-sm text-sm" :placeholder="t('items.warehouse')" />
        </template>

        <template #col-zone="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.zone || '—' }}</span>
          <FormDropdown v-else v-model="data.zone" :options="['Zone A', 'Zone B']" class="w-24 p-inputtext-sm text-sm" :placeholder="t('items.zone')" />
        </template>

        <template #col-unitPrice="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.unitPrice }}</span>
          <InputText v-else v-model.number="data.unitPrice" class="w-20 p-inputtext-sm" />
        </template>

        <template #col-tax="{ data }">
          <span v-if="disabled" class="text-gray-700">{{ data.tax }}%</span>
          <InputText v-else v-model.number="data.tax" class="w-16 p-inputtext-sm" prefix="%" />
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

    <ItemSelectionDialog v-model:visible="showItemDialog" :items="availableItems" @select="handleSelectItem" />

    <QuantitySerialDialog
      v-if="currentItem"
      v-model:visible="showQtyDialog"
      :item="currentItem"
      :initialSerials="currentItem.serials"
      @save="handleSaveSerials"
    />
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
