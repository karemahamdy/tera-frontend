<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import StatusCard from './StatusCard.vue';
import { computed } from 'vue';

const props = defineProps<{
  costingSummary: any;
}>();

const { t } = useI18n();
const cards = computed(() => {
  const labor = props.costingSummary?.laborCost ?? 0;
  const material = props.costingSummary?.materialCost ?? 0;
  const overhead = props.costingSummary?.overheadCost ?? 0;
  const machine = props.costingSummary?.machineCost ?? 0;

  const total = labor + material + overhead + machine;

  const getPercentage = (value: number) =>
    total ? ((value / total) * 100).toFixed(2) : '0';

  return [
    {
      variant: 'green',
      title: 'BOM.LaborCost',
      value: labor.toFixed(2),
      valueUnit: '$',
      subtitle: `${props.costingSummary?.laborCostPercentage}% ${t('BOM.ofTotalCost')}`,
    },
    {
      variant: 'blue',
      title: 'BOM.MaterialCost',
      value: material.toFixed(2),
      valueUnit: '$',
      subtitle: `${props.costingSummary?.materialCostPercentage}% ${t('BOM.ofTotalCost')}`,
    },
    {
      variant: 'orange',
      title: 'BOM.OverheadCost',
      value: overhead.toFixed(2),
      valueUnit: '$',
      subtitle: `${props.costingSummary?.overheadCostPercentage}% ${t('BOM.ofTotalCost')}`,
    },
    {
      variant: 'purple',
      title: 'BOM.MachineCost',
      value: machine.toFixed(2),
      valueUnit: '$',
      subtitle: `${getPercentage(machine)}% ${t('BOM.ofTotalCost')}`, 
    },
  ];
});

</script>

<template>
            <div class="grid gap-6 md:grid-cols-4 sm:grid-cols-2">
                <StatusCard v-for="(card, index) in cards" :key="index" v-bind="card" />
            </div>
            <div class="bg-[#EEF2FF] px-4 py-3 rounded-lg text-sm text-[#6366F1] flex justify-between mt-4">
            <span class="text-[#717680] text-center pt-3 text-[18px]">{{ $t('BOM.ofTotalCostPerUnit') }}</span>
            <span class="text-[#414651] text-[32px] font-bold">${{ props.costingSummary?.totalCostPerUnit }}</span>
               
            </div>
</template>
