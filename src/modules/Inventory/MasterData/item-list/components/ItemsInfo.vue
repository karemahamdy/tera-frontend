<script setup lang="ts">
import { computed, onMounted } from 'vue';
import StatusCard from '../../../../../sharedComponents/StatusCard.vue';
import { useItem } from '../composables/useItem';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { statistics, fetchItem } = useItem();

onMounted(() => {
  fetchItem();
});

const cards = computed(() => {
  const stats = statistics.value || {};

  return [
    {
      variant: 'blue',
      icon: 'Chart21',
      title: t('itemList.TotalItems'),
      value: stats.totalItems ?? 0,
    },
    {
      variant: 'green',
      icon: 'Verify',
      title: t('itemList.ActiveItems'),
      value: stats.activeItems ?? 0,
    },
    {
      variant: 'orange',
      icon: 'BoxTime',
      title: t('itemList.MinimumStock'),
      value: stats.minStockItems ?? 0,
    },
    {
      variant: 'pink',
      icon: 'TransmitSquare',
      title: t('itemList.OutOfStock'),
      value: stats.outOfStockItems ?? 0,
    },
  ];
});

</script>

<template>
    <div class="grid gap-6 md:grid-cols-4 sm:grid-cols-1 my-4">
        <StatusCard v-for="(card, index) in cards" :key="index" v-bind="card" />
    </div>
</template>
