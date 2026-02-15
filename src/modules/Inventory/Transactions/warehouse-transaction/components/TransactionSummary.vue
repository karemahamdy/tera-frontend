<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6 border-b border-gray-100 pb-4">
      <h2 class="text-lg font-bold text-gray-800">Transaction Details</h2>
      <p class="text-sm text-gray-500 mt-1">
        Reviewing all inbound, outbound, and internal stock movement
      </p>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
      <div>
        <p class="text-sm font-medium text-gray-400 mb-1">Waybill Date</p>
        <p class="text-base font-semibold text-gray-800">{{ data.waybillDate }}</p>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-400 mb-1">Inventory Request</p>
        <p class="text-base font-semibold text-gray-800">{{ data.inventoryRequest }}</p>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-400 mb-1">Transaction Direction</p>
        <p class="text-base font-semibold text-gray-800">{{ data.direction }}</p>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-400 mb-1">Warehouse</p>
         <p class="text-base font-semibold text-gray-800">{{ data.warehouse }}</p>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-400 mb-1">Zone</p>
         <p class="text-base font-semibold text-gray-800">{{ data.zone }}</p>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-400 mb-1">Type</p>
         <p class="text-base font-semibold text-gray-800">{{ data.type }}</p>
      </div>

       <div class="md:col-span-3">
        <p class="text-sm font-medium text-gray-400 mb-1">Cost Center</p>
         <p class="text-base font-semibold text-gray-800">{{ data.costCenter }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      waybillDate: '18 Jan 2026',
      inventoryRequest: 'REQ-TRF-2026-014',
      direction: 'Inbound',
      warehouse: 'Finished Goods',
      zone: 'Finished Goods Zone',
      type: 'Internal Transfer',
      costCenter: 'CC-FIN-001 – Finance'
    })
  }
})
</script>
