<script setup lang="ts">
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select'; 
import BaseButton from '@/sharedComponents/BaseButton.vue';
import ItemSelectionDialog from '@/modules/Inventory/shared/components/ItemSelectionDialog.vue';
import QuantitySerialDialog from '@/modules/Inventory/shared/components/QuantitySerialDialog.vue';

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

const removeItem = (index: number) => {
    items.value.splice(index, 1);
};

</script>

<template>
  <div class="flex flex-col h-full bg-white rounded-xl "> 
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Line Items</h2>
        <p class="text-gray-500 text-sm">Add items to your purchase waybill. Tracked items require serial/batch assignment.</p>
      </div>
      <BaseButton label="Add Item" icon="pi pi-plus" class="bg-primary-600 border-none hover:bg-primary-700 font-semibold px-4 py-2 rounded-lg" @click="openItemDialog" />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="text-gray-500 border-b border-gray-200 text-sm">
            <th class="py-3 px-2 font-medium">Item Code</th>
            <th class="py-3 px-2 font-medium">Item Name</th>
            <th class="py-3 px-2 font-medium">Quantity</th>
            <th class="py-3 px-2 font-medium">Uom</th>
            <th class="py-3 px-2 font-medium">Warehouse</th>
            <th class="py-3 px-2 font-medium">Zone</th>
            <th class="py-3 px-2 font-medium">Unit Price</th>
            <th class="py-3 px-2 font-medium">Tax %</th>
            <th class="py-3 px-2 font-medium">Total</th>
            <th class="py-3 px-2"></th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr v-for="(item, index) in items" :key="item.id" class="border-b border-gray-50 hover:bg-gray-50 group">
            
            <!-- Code & Name -->
            <td class="py-3 px-2 flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">
                    <i class="pi pi-box"></i>
                </div>
                <span class="font-medium text-gray-900">{{ item.code }}</span>
            </td>
            <td class="py-3 px-2">
                <span class="text-gray-600">{{ item.name }}</span>
            </td>

            <!-- Quantity with Add BaseButton -->
            <td class="py-3 px-2">
              <div class="flex items-center gap-2">
      <BaseButton label="Add" variant="outline-primary"   @click="openQtyDialog(item)" />
                <span class="text-gray-500">({{ item.quantity }})</span>
              </div>
            </td>

            <!-- UOM -->
            <td class="py-3 px-2">
               <Select v-model="item.uom" :options="['PCS', 'KG', 'LTR']" class="w-20 p-inputtext-sm text-sm" />
            </td>

            <!-- Warehouse -->
            <td class="py-3 px-2">
               <Select v-model="item.warehouse" :options="['WH-011', 'WH-012']" class="w-24 p-inputtext-sm text-sm" placeholder="WH" />
            </td>

             <!-- Zone -->
             <td class="py-3 px-2">
               <Select v-model="item.zone" :options="['Zone A', 'Zone B']" class="w-24 p-inputtext-sm text-sm" placeholder="Zone" />
            </td>

            <!-- Price -->
            <td class="py-3 px-2">
               <InputText v-model.number="item.unitPrice" class="w-20 p-inputtext-sm" />
            </td>

             <!-- Tax -->
             <td class="py-3 px-2">
               <InputText v-model.number="item.tax" class="w-16 p-inputtext-sm" prefix="%" />
            </td>

             <!-- Total -->
             <td class="py-3 px-2 font-medium text-gray-900">
               {{ item.total.toFixed(2) }}
            </td>

            <!-- Delete -->
            <td class="py-3 px-2 text-right">
              <button class="text-red-400 hover:text-red-600" @click="removeItem(index)">
                 <VsxIcon iconName="Trash" :size="20" type="linear"
             color="#F04438" />     
              </button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- Subtotal Footer -->
    <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <span class="text-gray-600 font-medium">Subtotal ({{ items.length }} Items):</span>
        <span class="text-xl font-bold text-primary-600">${{ subtotal.toFixed(2) }}</span>
    </div>


    <!-- ================= DIALOGS ================= -->

    <ItemSelectionDialog 
      v-model:visible="showItemDialog" 
      :items="availableItems" 
      @select="handleSelectItem" 
    />

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
</style>
