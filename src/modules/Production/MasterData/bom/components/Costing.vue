<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import StatusCard from './StatusCard.vue';
import { computed } from 'vue';

const props = defineProps<{
  costingSummary: any;
}>();

const { t } = useI18n();

const cards = computed(() => [
  {
    variant: 'green',
    title: 'BOM.LaborCost',
    value: props.costingSummary?.laborCost?.toFixed(2) ?? '0',
    valueUnit: '$',
    subtitle: `${props.costingSummary?.laborCostPercentage ?? 0}% ${t('BOM.ofTotalCost')}`,
  },
  {
    variant: 'blue',
    title: 'BOM.MaterialCost',
    value: props.costingSummary?.materialCost?.toFixed(2) ?? '0',
    valueUnit: '$',
    subtitle: `${props.costingSummary?.materialCostPercentage ?? 0}% ${t('BOM.ofTotalCost')}`,
  },
  {
    variant: 'orange',
    title: 'BOM.OverheadCost',
    value: props.costingSummary?.overheadCost?.toFixed(2) ?? '0',
    valueUnit: '$',
    subtitle: `${props.costingSummary?.overheadCostPercentage ?? 0}% ${t('BOM.ofTotalCost')}`,
  },
  {
    variant: 'purple',
    title: 'BOM.MachineCost',
    value: props.costingSummary?.machineCost?.toFixed(2) ?? '0',
    valueUnit: '$',
    subtitle: `${props.costingSummary?.overheadCostPercentage ?? 0}% ${t('BOM.ofTotalCost')}`,
  },
]);
const totalCostPerUnit = computed(() => {
  const labor = props.costingSummary?.laborCost ?? 0;
  const material = props.costingSummary?.materialCost ?? 0;
  const overhead = props.costingSummary?.overheadCost ?? 0;

  return (labor + material + overhead).toFixed(2);
});
</script>

<template>
            <div class="grid gap-6 md:grid-cols-4 sm:grid-cols-2">
                <StatusCard v-for="(card, index) in cards" :key="index" v-bind="card" />
            </div>
            <div class="bg-[#EEF2FF] px-4 py-3 rounded-lg text-sm text-[#6366F1] flex justify-between mt-4">
            <span class="text-[#717680] text-center pt-3 text-[18px]">{{ $t('BOM.ofTotalCostPerUnit') }}</span>
            <span class="text-[#414651] text-[32px] font-bold">${{ totalCostPerUnit }}</span>
               
            </div>
</template>
