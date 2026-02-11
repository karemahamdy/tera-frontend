<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useItem } from "../composables/useItem";
import type { ItemPricingResponse } from "../types/itemList";

const route = useRoute();
const { fetchItemPricing } = useItem();

const pricingData = ref<ItemPricingResponse | null>(null);
const loading = ref(false);

const id = route.params.id as string;

onMounted(async () => {
    if (id) {
        loading.value = true;
        const response = await fetchItemPricing(id);
        if (response) {
            pricingData.value = response;
        }
        loading.value = false;
    }
});
</script>

<template>
  <div v-if="!loading && pricingData" class="grid grid-cols-1 md:grid-cols-2 gap-6">
  
    <!-- Last Purchase Price -->
    <div v-if="pricingData.lastPurchasePriceDto" class="border border-gray-200 rounded-[12px] p-6 bg-white shadow-sm">
      <h3 class="text-gray-700 font-bold text-lg mb-4">{{ $t('itemList.pricingTab.lastPurchasePricing') }}</h3>
      
      <div class="space-y-3">
        <div class="flex justify-between items-center p-4 rounded-[8px] bg-[#ECFDF3]">
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-900">{{ pricingData.lastPurchasePriceDto.unitName }}</span>
            <span class="text-gray-400 text-sm">{{ pricingData.lastPurchasePriceDto.baseName }}</span>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-[#638EFF]">
              {{ pricingData.lastPurchasePriceDto.basePricing }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Last Sales Price -->
    <div v-if="pricingData.lastSalsePriceDto" class="border border-gray-200 rounded-[12px] p-6 bg-white shadow-sm">
      <h3 class="text-gray-700 font-bold text-lg mb-4">{{ $t('itemList.pricingTab.salesPricing') }}</h3>
      
      <div class="space-y-3">
        <div class="flex justify-between items-center p-4 rounded-[8px] bg-[#ECFDF3]">
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-900">{{ pricingData.lastSalsePriceDto.unitName }}</span>
            <span class="text-gray-400 text-sm">{{ pricingData.lastSalsePriceDto.baseName }}</span>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-success-400">
              {{ pricingData.lastSalsePriceDto.basePricing }}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <div v-else class="p-4 text-center text-gray-500">
      {{ $t('itemList.overview.noPricingData') }}
  </div>
</template>
