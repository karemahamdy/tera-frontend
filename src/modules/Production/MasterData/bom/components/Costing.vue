<script setup lang="ts">
import StatusCard from './StatusCard.vue';
import { computed } from 'vue';

const cards = computed(() => {
    return [
        {
            variant: 'green', 
            title: 'BOM.LaborCost',
            value: "5456",
            valueUnit: '$',
            subtitle: 'BOM.ofTotalCost',
        },
        {
            variant: 'blue',   
            title: 'BOM.MaterialCost',
            value: "5646845",
            valueUnit: '$',
            subtitle: 'BOM.ofTotalCost',
        },
          {
            variant: 'orange',    
            title: 'BOM.OverheadCost',
            value:"510",
            valueUnit: '$',
            subtitle: 'BOM.ofTotalCost',
        }
    ];
});
</script>

<template>
            <div class="grid gap-6 md:grid-cols-3 sm:grid-cols-1">
                <StatusCard v-for="(card, index) in cards" :key="index" v-bind="card" />
            </div>
            <div class="bg-[#EEF2FF] px-4 py-3 rounded-lg text-sm text-[#6366F1] flex justify-between mt-4">
            <span class="text-[#717680] text-center pt-3 text-[18px]">{{ $t('BOM.ofTotalCostPerUnit') }}</span>
            <span class="text-[#414651] text-[32px] font-bold">$27.10</span>
               
            </div>
</template>
