<script setup lang="ts">
import { computed } from 'vue';
import InputText from 'primevue/inputtext';
// import VsxIcon from "@/components/Icons/VsxIcon.vue"; // Assuming global

const props = defineProps({
    subTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    currency: { type: String, default: 'SAR' }
});

const globalDiscount = defineModel('globalDiscount', { default: "000" });

</script>

<template>
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
                <span class="text-gray-600">Sub total ({{ currency }})</span>
                <span class="font-bold text-success-500">{{ currency }} 12,600.00</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total Tax ($)</span>
                <span class="font-bold text-gray-700">{{ taxTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">Total Tax ({{ currency }})</span>
                <span class="font-bold text-success-500">{{ currency }} 229.25</span>
            </div>
        </div>

        <div class="p-4  border-t border-b border-gray-300">
            <label class="text-xs font-medium text-gray-700 uppercase mb-1 block">Global Discount</label>
            <div class="flex items-center gap-2">
                <InputText v-model.number="globalDiscount" prefix="-$" placeholder="0.00"
                    class="flex-1 bg-gray-50 border-none" />
                <span class="text-success-500 text-sm font-bold">-{{ currency }} 0.00</span>
            </div>
        </div>

        <div class=" border-t border-gray-200">
            <div class="flex justify-between items-end mb-1">
                <span class="text-gray-700 font-bold text-lg">Grand Total</span>
                <span class="text-primary-700 font-bold text-2xl">${{ grandTotal }}</span>
            </div>
            <div class="flex justify-between items-end mb-1">
                <span class="text-left text-gray-500 font-light text-base">Include all taxes and fees</span>
                <span class="text-right text-success-500 text-sm font-medium">{{ currency }} 13,814.25</span>
            </div>
        </div>
    </div>
</template>
