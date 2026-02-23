<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps({
    subTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    
    currency: { type: String, default: 'USD' },
    exchangeRate: { type: Number, default: 1 },
    baseCurrency: { type: String, default: 'USD' }
});

const globalDiscount = defineModel('globalDiscount', { default: 0 });

const subTotalBase = computed(() => props.subTotal * props.exchangeRate);
const taxTotalBase = computed(() => props.taxTotal * props.exchangeRate);
const grandTotalBase = computed(() => props.grandTotal * props.exchangeRate);
const discountBase = computed(() => (Number(globalDiscount.value) || 0) * props.exchangeRate);

</script>

<template>
    <div class="bg-primary-50 rounded-xl p-6 border border-gray-100 sticky top-4">
        <h3 class="font-bold text-lg text-gray-700 mb-4 flex items-center gap-2">
            <VsxIcon iconName="MenuBoard" :size="20" type="linear" color="#3F5FAC" />
            {{ $t('summary.title') }}
        </h3>

        <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">{{ $t('summary.subTotalUSD') }}</span>
                <span class="font-bold text-gray-700">${{ props.subTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm" v-if="currency !== baseCurrency">
                <span class="text-gray-600">{{ $t('summary.subTotal') }} ({{ baseCurrency }})</span>
                <span class="font-bold text-success-500">{{ baseCurrency }} {{ subTotalBase.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-600">{{ $t('summary.totalTaxUSD') }}</span>
                <span class="font-bold text-gray-700">${{ props.taxTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm" v-if="currency !== baseCurrency">
                <span class="text-gray-600">{{ $t('summary.totalTax') }} ({{ baseCurrency }})</span>
                <span class="font-bold text-success-500">{{ baseCurrency }} {{ taxTotalBase.toFixed(2) }}</span>
            </div>
        </div>

        <div class="p-4 border-t border-b border-gray-300">
            <label class="text-xl font-medium text-gray-700 uppercase mb-1 block">
                {{ $t('summary.globalDiscount') }}
            </label>
            <div class="flex items-center gap-2">
                <InputNumber v-model.number="globalDiscount" prefix="-$" placeholder="0.00"
                    class="flex-1 bg-gray-50 border-none" />
                <span class="text-success-500 text-sm font-bold" v-if="currency !== baseCurrency">-{{ baseCurrency }} {{ discountBase.toFixed(2) }}</span>
            </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between items-end mb-1">
                <span class="text-gray-700 font-bold text-lg">{{ $t('summary.grandTotal') }}</span>
                <span class="text-primary-700 font-bold text-2xl">${{ props.grandTotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-end mb-1" v-if="currency !== baseCurrency">
                <span class="text-left text-gray-500 font-light text-base">{{ $t('summary.includeAllTaxes') }}</span>
                <span class="text-right text-success-500 text-sm font-medium">{{ baseCurrency }} {{ grandTotalBase.toFixed(2) }}</span>
            </div>
        </div>
    </div>
</template>
