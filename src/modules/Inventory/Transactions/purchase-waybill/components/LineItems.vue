<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import InputText from 'primevue/inputtext';
import Select from 'primevue/select'; // PrimeVue 4 uses Select instead of Dropdown
import Dialog from 'primevue/dialog';


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
const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.total, 0));

// --- Item Selection Dialog ---
const showItemDialog = ref(false);
const searchQuery = ref('');
const availableItems = ref([
  { code: 'ITM-001', name: 'Hydraulic Pump Model A', unit: 'PCS' },
  { code: 'ITM-045', name: 'Industrial Bearing 6205', unit: 'PCS' },
  { code: 'ITM-269', name: 'Steel Plate 10mm', unit: 'SHT' },
  { code: 'ITM-156', name: 'Lubricant Oil SAE 40', unit: 'LTR' },
]);

const openItemDialog = () => {
    showItemDialog.value = true;
};

const addItem = (item: any) => {
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
    showItemDialog.value = false;
};

// --- Quantity/Serial Dialog ---
const showQtyDialog = ref(false);
const currentItem = ref<any>(null);
const serialInput = ref('');
const qtyInput = ref("0");
const batchInput = ref('');
const expireDateInput = ref();
const serialList = ref<any[]>([]);

const openQtyDialog = (item: any) => {
    currentItem.value = item;
    serialList.value = [...item.serials];
    showQtyDialog.value = true;
};

const addSerial = () => {
    if (!serialInput.value && !qtyInput.value) return;
    
    serialList.value.push({
        serial: serialInput.value,
        qty: qtyInput.value || 1,
        batch: batchInput.value,
        expire: expireDateInput.value,
        comment: ''
    });
    
    // Reset inputs
    serialInput.value = '';
    // Keep batch/expire for convenience?
};

const saveSerials = () => {
    if (currentItem.value) {
        currentItem.value.serials = [...serialList.value];
        currentItem.value.quantity = serialList.value.reduce((acc, curr) => acc + Number(curr.qty), 0);
    }
    showQtyDialog.value = false;
};

const removeSerial = (index: number) => {
    serialList.value.splice(index, 1);
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

    <!-- Select Item Dialog -->
    <Dialog v-model:visible="showItemDialog" modal header="Select Item" :style="{ width: '50vw' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
        <div class="flex flex-col gap-4">
            <span class="p-input-icon-left w-full">
                <i class="pi pi-search" />
                <InputText v-model="searchQuery" placeholder="Search items..." class="w-full bg-gray-50 border-gray-200" />
            </span>
            
            <div class="overflow-y-auto max-h-[400px]">
                <div v-for="item in availableItems" :key="item.code" class="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                             <i class="pi pi-box"></i>
                        </div>
                        <div>
                            <div class="font-bold text-gray-900">{{ item.code }}</div>
                            <div class="text-sm text-gray-500">{{ item.name }}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="text-gray-500 text-sm">{{ item.unit }}</span>
                        <BaseButton label="Add" size="small" class="bg-primary-800 hover:bg-primary-900 text-white text-xs px-4" @click="addItem(item)" />
                    </div>
                </div>
            </div>
        </div>
    </Dialog>

    <!-- Add Quantity/Serial Dialog -->
    <Dialog v-model:visible="showQtyDialog" modal :header="`Add Quantity - ${currentItem?.code}`" :style="{ width: '60vw' }" :breakpoints="{ '960px': '75vw', '641px': '95vw' }">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left Form -->
            <div class="w-full md:w-1/3 flex flex-col gap-4">
                <h3 class="font-bold text-lg text-gray-900">Select Quantity</h3>
                
                <div class="flex flex-col gap-1">
                    <label class="text-xs text-gray-600 font-medium">Serial</label>
                     <InputText v-model="serialInput" placeholder="Enter Serial" class="w-full" />
                </div>

                 <div class="flex gap-2">
                    <div class="flex flex-col gap-1 w-1/2">
                        <label class="text-xs text-gray-600 font-medium">Quantity</label>
                        <InputText v-model.number="qtyInput" placeholder="0" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-1 w-1/2">
                        <label class="text-xs text-gray-600 font-medium">Batch Number</label>
                        <InputText v-model="batchInput" placeholder="Batch ID" class="w-full" />
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-xs text-gray-600 font-medium">Expire Date</label>
                     <DatePicker v-model="expireDateInput" placeholder="Enter Expire date" class="w-full" />
                </div>

                <div class="flex flex-col gap-1">
                     <label class="text-xs text-gray-600 font-medium">Comment</label>
                     <Textarea v-model="serialInput" rows="3" placeholder="Additional notes..." class="w-full resize-none" />
                </div>

                <BaseButton label="Add Serial" class="w-full bg-primary-700 hover:bg-primary-800 text-white mt-2" @click="addSerial" />
                <BaseButton label="Cancel" variant="ghost" @click="showQtyDialog = false" />
            </div>

            <!-- Right list -->
            <div class="w-full md:w-2/3 bg-primary-50 rounded-lg p-4">
                <div class="flex justify- items-center mb-4">
                    <h3 class="font-bold text-lg text-gray-900">Added Serial</h3>
                    <span class="text-sm text-gray-500">Identify items to return from selected original waybill.</span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="text-xs text-gray-500 uppercase border-b border-gray-200">
                            <tr>
                                <th class="py-2">Serial</th>
                                <th class="py-2">QTY</th>
                                <th class="py-2">Batch</th>
                                <th class="py-2">Expire</th>
                                <th class="py-2">Comment</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-700">
                             <tr v-for="(s, idx) in serialList" :key="idx" class="border-b border-gray-100">
                                <td class="py-2 font-medium">{{ s.serial }}</td>
                                <td class="py-2">{{ s.qty }}</td>
                                <td class="py-2 text-xs uppercase bg-gray-100 px-1 rounded">{{ s.batch }}</td>
                                <td class="py-2 text-gray-500">{{ s.expire ? new Date(s.expire).toLocaleDateString() : '-' }}</td>
                                <td class="py-2 text-gray-500 truncate max-w-[100px]">{{ s.comment }}</td>
                                <td class="py-2 text-right">
                                    <button class="text-red-400 hover:text-red-600" @click="removeSerial(idx)">
                                        <i class="pi pi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                 <div class="flex justify-between items-center mt-auto p-4 border-t border-gray-200 bg-white">
                     <div class="flex flex-col">
                        <span class="text-xs text-gray-500">Total QTY</span>
                        <span class="text-xl font-bold text-primary-700">{{ serialList.reduce((acc, curr) => acc + Number(curr.qty), 0) }}</span>
                     </div>
                     <div class="flex gap-2">
                         <BaseButton label="Cancel" variant="ghost" @click="showQtyDialog = false" />
                         <BaseButton label="Finalize & Save" class="bg-primary-800 text-white border-none hover:bg-primary-900" @click="saveSerials" />
                     </div>
                 </div>

            </div>
        </div>
    </Dialog>

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
