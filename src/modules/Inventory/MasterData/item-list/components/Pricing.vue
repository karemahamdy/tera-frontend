<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const pricingData = {
  lastPurchase: {
    title: 'itemList.pricingTab.lastPurchasePricing',
    prices: [
      { unit: 'BOX', conversion: 'boxConversion', price: 540, currency: '$', type: 'purchase' },
      { unit: 'PCS', conversion: 'pcsConversion', price: 450, currency: '$', type: 'purchase' }
    ]
  },
  salesPricing: {
    title: 'itemList.pricingTab.salesPricing',
    prices: [
      { unit: 'BOX', conversion: 'boxConversion', price: 620, currency: '$', type: 'sales' },
      { unit: 'PCS', conversion: 'pcsConversion', price: 520, currency: '$', type: 'sales' }
    ]
  },
  purchaseAverage: {
    title: 'itemList.pricingTab.purchaseAverage',
    prices: [
      { unit: 'BOX', conversion: 'boxConversion', price: 520, currency: '$', type: 'purchase' },
      { unit: 'PCS', conversion: 'pcsConversion', price: 45, currency: '$', type: 'purchase' }
    ]
  },
  salesAverage: {
    title: 'itemList.pricingTab.salesAverage',
    prices: [
      { unit: 'BOX', conversion: 'boxConversion', price: 620, currency: '$', type: 'sales' },
      { unit: 'PCS', conversion: 'pcsConversion', price: 52, currency: '$', type: 'sales' }
    ]
  }
};

const getPriceColor = (type: string) => {
  return type === 'purchase' ? 'text-[#638EFF]' : 'text-success-400';
};

const getRowBackground = (index: number) => {
  return index === 0 ? 'bg-[#ECFDF3]' : 'bg-[#F5F8FF]'; 
};

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  
    <div v-for="(section, key) in pricingData" :key="key" class="border border-gray-200 rounded-[12px] p-6 bg-white shadow-sm">
      <h3 class="text-gray-700 font-bold text-lg mb-4">{{ $t(section.title) }}</h3>
      
      <div class="space-y-3">
        <div 
          v-for="(item, index) in section.prices" 
          :key="item.unit" 
          class="flex justify-between items-center p-4 rounded-[8px]"
          :class="getRowBackground(index)"
        >
        
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-900">{{ $t('itemList.pricingTab.' + (item.unit === 'BOX' ? 'box' : 'pcs')) }}</span>
            <span class="text-gray-400 text-sm">{{ $t('itemList.pricingTab.' + item.conversion) }}</span>
          </div>

          <div class="text-right">
            <div class="text-2xl font-bold" :class="getPriceColor(item.type)">
              {{ item.currency }}{{ item.price }}
            </div>
            <div class="text-xs text-gray-500 font-medium">
               {{ $t('itemList.pricingTab.' + (item.unit === 'BOX' ? 'perBox' : 'perPcs')) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
