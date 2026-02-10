<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
// import Textarea from 'primevue/textarea';
import RadioButton from 'primevue/radiobutton';

// const { t } = useI18n();
const emit = defineEmits(['prev', 'submit']);

const paymentType = ref('Payable'); // Payable or Cash
const paymentTerms = ref(null);
const incoterms = ref(null);
const comments = reactive({
    comment1: '',
    comment2: '',
    comment3: '',
    comment4: '',
    comment5: ''
});

// Mock Data
const subTotal = ref(4585.00);
const taxTotal = ref(-229.25);
const globalDiscount = ref("000");

const grandTotal = 4814.25; // Calculation logic would go here


</script>

<template>
    <div class="h-full">
        <h2 class="text-xl font-bold text-gray-700 mb-10">Payment & Finance Info</h2>

        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left Column: Payment Details & Comments -->
            <div class="flex-1 flex flex-col gap-6">

                <!-- Payment Type -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                    <div class="flex gap-4">
                        <div class="flex-1 border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-primary-500 transition-colors"
                            :class="{ 'border-primary-500 bg-primary-50': paymentType === 'Payable', 'border-gray-200': paymentType !== 'Payable' }"
                            @click="paymentType = 'Payable'">
                            <div>
                                <div class="font-bold text-gray-700">Payable</div>
                                <div class="text-xs text-gray-500">Pay via invoice</div>
                            </div>
                            <RadioButton v-model="paymentType" inputId="payable" value="Payable" />
                        </div>

                        <div class="flex-1 border rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-primary-500 transition-colors"
                            :class="{ 'border-primary-500 bg-primary-50': paymentType === 'Cash', 'border-gray-200': paymentType !== 'Cash' }"
                            @click="paymentType = 'Cash'">
                            <div>
                                <div class="font-bold text-gray-700">Cash</div>
                                <div class="text-xs text-gray-500">Immediate Payment</div>
                            </div>
                            <RadioButton v-model="paymentType" inputId="cash" value="Cash" />
                        </div>
                    </div>
                </div>

                <!-- Payment Terms & Incoterms -->
                <div class="grid grid-cols-2 gap-4">
                      <div class="flex flex-col gap-1 md:col-span-2">
                        <label class="text-sm font-medium text-gray-700">Payment Terms</label>
                        <Select v-model="paymentTerms" :options="['Net 30 Days', 'Immediate']"
                            placeholder="Select Terms" class="w-full" />
                    </div>
                      <div class="flex flex-col gap-1 md:col-span-2">
                        <label class="text-sm font-medium text-gray-700">Import/Local Type</label>
                        <Select :options="['Import', 'Local']" placeholder="Select Type" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-1 md:col-span-2">
                        <label class="text-sm font-medium text-gray-700">Incoterms <span
                                class="text-red-500">*</span></label>
                        <Select v-model="incoterms" :options="['CIF (Cost, Insurance and Freight)', 'FOB']"
                            placeholder="Select Incoterms" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Right Column: Summary -->
            <div class="w-full lg:w-1/3">
                <div class="bg-primary-50 rounded-xl p-6 border border-gray-100 sticky top-4">
                    <h3 class="font-bold text-lg text-gray-700 mb-4 flex items-center gap-2">
                        <VsxIcon iconName="MenuBoard" :size="20" type="linear" color="#3F5FAC" />
                        Summary
                    </h3>

                    <div class="space-y-3 mb-6">
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Sub total ($)</span>
                            <span class="font-bold text-gray-700">${{ subTotal.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Sub total (SAR)</span>
                            <span class="font-bold text-success-500">SAR 12,600.00</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Total Tax ($)</span>
                            <span class="font-bold text-gray-700">{{ taxTotal.toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">Total Tax (SAR)</span>
                            <span class="font-bold text-success-500">SAR 229.25</span>
                        </div>
                    </div>

                    <div class="p-4  border-t border-b border-gray-300">
                        <label class="text-xs font-medium text-gray-700 uppercase mb-1 block">Global Discount</label>
                        <div class="flex items-center gap-2">
                            <InputText v-model.number="globalDiscount" prefix="-$" placeholder="0.00"
                                class="flex-1 bg-gray-50 border-none" />
                            <span class="text-success-500 text-sm font-bold">-SAR 0.00</span>
                        </div>
                    </div>

                    <div class=" border-t border-gray-200">
                        <div class="flex justify-between items-end mb-1">
                            <span class="text-gray-700 font-bold text-lg">Grand Total</span>
                            <span class="text-primary-700 font-bold text-2xl">${{ grandTotal }}</span>
                        </div>
                        <div class="flex justify-between items-end mb-1">
                         <span class="text-left text-gray-500 font-light text-base">Include all taxes and fees</span>
                            <span class="text-right text-success-500 text-sm font-medium">SAR 13,814.25</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
      <!-- Comments Section -->
                <div>
                    <h3 class="font-bold text-lg text-gray-700 mb-4 mt-2">Notes & Comments</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium text-gray-700">Comment 1</label>
                            <InputText v-model="comments.comment1" placeholder="Additional Notes or Comments.." />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium text-gray-700">Comment 2</label>
                            <InputText v-model="comments.comment2" placeholder="Additional Notes or Comments.." />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium text-gray-700">Comment 3</label>
                            <InputText v-model="comments.comment3" placeholder="Additional Notes or Comments.." />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-sm font-medium text-gray-700">Comment 4</label>
                            <InputText v-model="comments.comment4" placeholder="Additional Notes or Comments.." />
                        </div>
                        <div class="flex flex-col gap-1 md:col-span-2">
                            <label class="text-sm font-medium text-gray-700">Comment 5</label>
                            <InputText v-model="comments.comment5" placeholder="Additional Notes or Comments.." />
                        </div>
                    </div>
                </div>
</template>

<style scoped>
:deep(.p-inputtext) {
    background-color: #f9fafb;
    border-color: #e5e7eb;
}

:deep(.p-select) {
    background-color: #f9fafb;
    border-color: #e5e7eb;
}
</style>
