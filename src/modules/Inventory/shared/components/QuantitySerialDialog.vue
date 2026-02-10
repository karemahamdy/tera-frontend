<script setup lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import DatePicker from 'primevue/datepicker';

const props = defineProps<{
  visible: boolean;
  item: any;
  initialSerials?: any[];
}>();

const emit = defineEmits(['update:visible', 'save']);

const localVisible = ref(props.visible);
const serialInput = ref('');
const qtyInput = ref<string>("0");
const batchInput = ref('');
const expireDateInput = ref();
const serialList = ref<any[]>([]);



const addSerial = () => {
    // Basic validation
    if (!serialInput.value && (!qtyInput.value)) return;
    
    serialList.value.push({
        serial: serialInput.value,
        qty: qtyInput.value || "1",
        batch: batchInput.value,
        expire: expireDateInput.value,
        comment: ''
    });
    
    serialInput.value = '';
    // Optional: reset other fields
};

const removeSerial = (index: number) => {
    serialList.value.splice(index, 1);
};

const save = () => {
    const totalQty = serialList.value.reduce((acc, curr) => acc + Number(curr.qty), 0);
    emit('save', { serials: serialList.value, totalQty });
    localVisible.value = false;
};

const close = () => {
    localVisible.value = false;
};

</script>

<template>
    <Dialog v-model:visible="localVisible" modal :header="`Add Quantity - ${item?.code || ''}`" :style="{ width: '60vw' }" :breakpoints="{ '960px': '75vw', '641px': '95vw' }">
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
                <BaseButton label="Cancel" variant="ghost" @click="close" />
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
                                        <VsxIcon iconName="Trash" :size="20" type="linear" color="#F04438" />
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
                         <BaseButton label="Cancel" variant="ghost" @click="close" />
                         <BaseButton label="Finalize & Save" class="bg-primary-800 text-white border-none hover:bg-primary-900" @click="save" />
                     </div>
                 </div>

            </div>
        </div>
    </Dialog>
</template>
