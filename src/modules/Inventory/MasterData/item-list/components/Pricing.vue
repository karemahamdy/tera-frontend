<script setup lang="ts">


const pricingData = {
  lastPurchase: {
    title: 'Last Purchase Pricing',
    prices: [
      { unit: 'BOX', conversion: '(1 BOX = 12 PCS)', price: 540, currency: '$', type: 'purchase' },
      { unit: 'PCS', conversion: '(1 PCS)', price: 450, currency: '$', type: 'purchase' }
    ]
  },
  salesPricing: {
    title: 'Sales Pricing',
    prices: [
      { unit: 'BOX', conversion: '(1 BOX = 12 PCS)', price: 620, currency: '$', type: 'sales' },
      { unit: 'PCS', conversion: '(1 PCS)', price: 520, currency: '$', type: 'sales' }
    ]
  },
  purchaseAverage: {
    title: 'Purchase Average',
    prices: [
      { unit: 'BOX', conversion: '(1 BOX = 12 PCS)', price: 520, currency: '$', type: 'purchase' },
      { unit: 'PCS', conversion: '(1 PCS)', price: 45, currency: '$', type: 'purchase' }
    ]
  },
  salesAverage: {
    title: 'Sales Average',
    prices: [
      { unit: 'BOX', conversion: '(1 BOX = 12 PCS)', price: 620, currency: '$', type: 'sales' },
      { unit: 'PCS', conversion: '(1 PCS)', price: 52, currency: '$', type: 'sales' }
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
      <h3 class="text-gray-700 font-bold text-lg mb-4">{{ section.title }}</h3>
      
      <div class="space-y-3">
        <div 
          v-for="(item, index) in section.prices" 
          :key="item.unit" 
          class="flex justify-between items-center p-4 rounded-[8px]"
          :class="getRowBackground(index)"
        >
        
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-900">{{ item.unit }}</span>
            <span class="text-gray-400 text-sm">{{ item.conversion }}</span>
          </div>

          
          <div class="text-right">
            <div class="text-2xl font-bold" :class="getPriceColor(item.type)">
              {{ item.currency }}{{ item.price }}
            </div>
            <div class="text-xs text-gray-500 font-medium">
               Per {{ item.unit === 'BOX' ? 'Box' : 'PCS' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
