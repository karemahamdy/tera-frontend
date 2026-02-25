<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()

defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      waybillDate: '18 Jan 2026',
      inventoryRequest: 'REQ-TRF-2026-014',
      direction: 'Transfer',
      warehouse: 'Finished Goods',
      zone: 'Finished Goods Zone',
      type: 'Internal Transfer',
      costCenter: 'CC-FIN-001 – Finance',
      source: {
        warehouse: 'Main Warehouse',
        zone: 'Raw Materials Zone'
      },
      destination: {
        warehouse: 'Finished Goods',
        zone: 'Finished Goods Zone'
      }
    })
  }
})
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6 border-b border-gray-100 pb-4">
      <h2 class="text-lg font-bold text-gray-800">
        {{ t('transaction.details') }}
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        {{ t('transaction.reviewDescription') }}
      </p>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
      <div>
        <p class="text-sm font-medium text-gray-400 mb-1">{{ t('transaction.waybillDate') }}</p>
        <p class="text-base font-semibold text-gray-800">{{ data.waybillDate }}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-400 mb-1">{{ t('transaction.inventoryRequest') }}</p>
        <p class="text-base font-semibold text-gray-800">{{ data.inventoryRequest }}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-400 mb-1">{{ t('transaction.direction') }}</p>
        <p class="text-base font-semibold text-gray-800">{{ data.direction }}</p>
      </div>

      <div v-if="data.direction !== 'Transfer'">
        <p class="text-sm font-medium text-gray-400 mb-1">{{ t('transaction.warehouse') }}</p>
        <p class="text-base font-semibold text-gray-800">{{ data.warehouse }}</p>
      </div>

      <div v-if="data.direction !== 'Transfer'">
        <p class="text-sm font-medium text-gray-400 mb-1">{{ t('transaction.zone') }}</p>
        <p class="text-base font-semibold text-gray-800">{{ data.zone }}</p>
      </div>

      <div v-if="data.direction !== 'Transfer'">
        <p class="text-sm font-medium text-gray-400 mb-1">{{ t('transaction.type') }}</p>
        <p class="text-base font-semibold text-gray-800">{{ data.type }}</p>
      </div>

      <div class="md:col-span-3" v-if="data.direction !== 'Transfer'">
        <p class="text-sm font-medium text-gray-400 mb-1">{{ t('transaction.costCenter') }}</p>
        <p class="text-base font-semibold text-gray-800">{{ data.costCenter }}</p>
      </div>
    </div>


    <div v-if="data.direction === 'Transfer'" class="mt-8 pt-6 border-t border-gray-100">
      <h3 class="text-sm font-semibold text-gray-800 mb-4">
        {{ t('transaction.transferDetails') }}
      </h3>

      <div class="flex flex-col md:flex-row items-center gap-4">
        
        <div class="flex-1 w-full bg-primary-50 rounded-xl p-4 border border-primary-100">
          <p class="text-primary-700 font-bold mb-3 text-sm">
            {{ t('transaction.source') }}
          </p>

          <div class="grid grid-cols-2 gap-4">
            <div >
              <p class="text-xs text-gray-500 mb-1">{{ t('transaction.warehouse') }}</p>
              <p class="text-sm font-semibold text-gray-800">{{ data.source?.warehouse || '-' }}</p>
            </div>
            <div >
              <p class="text-xs text-gray-500 mb-1">{{ t('transaction.zone') }}</p>
              <p class="text-sm font-semibold text-gray-800">{{ data.source?.zone || '-' }}</p>
            </div>
          </div>
        </div>

        <div class="flex-shrink-0 text-primary-500">
          <VsxIcon iconName="ArrowRight" type="linear" :size="24" />
        </div>

        <div class="flex-1 w-full bg-primary-50 rounded-xl p-4 border border-primary-100">
          <p class="text-primary-700 font-bold mb-3 text-sm">
            {{ t('transaction.destination') }}
          </p>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-gray-500 mb-1">{{ t('transaction.warehouse') }}</p>
              <p class="text-sm font-semibold text-gray-800">{{ data.destination?.warehouse || '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-1">{{ t('transaction.zone') }}</p>
              <p class="text-sm font-semibold text-gray-800">{{ data.destination?.zone || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
