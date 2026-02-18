<script setup lang="ts">
</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="Edit Opening Balance" />
    <card class="bg-white rounded-[10px]">
      <!-- PageHeader component -->
      <template #title>
        <PageHeader title="Edit Opening Balance" subtitle="Capture existing stock at system go-live"
          :showSearch="false" />
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <div class="w-full">
          <FormInput :label="$t('itemHold.item')" class="w-full" disabled
            :placeholder="$t('itemHold.itemPlaceholder')" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2">
          <FormDropdown class="w-full mt-5" :label="$t('items.warehouse')" :options="[]" optionValue="value"
            :placeholder="$t('items.warehousePlaceholder')" />

          <FormDropdown class="w-full mt-5" :label="$t('zone')" :options="[]" optionValue="value"
            :placeholder="$t('zone')" />

          <FormInput :label="$t('Date')" type="date" class="mt-5" :placeholder="$t('Date')" />
          <FormDropdown class="w-full mt-5" :label="$t('Unit Of Measure')" :options="[]" optionValue="value"
            :placeholder="$t('UOM')" />

          <FormInput :label="$t('Unit Cost')" class="mt-5" :placeholder="$t('Unit Cost')" />

          <FormInput :label="$t('itemHold.quantity')" class="mt-5" :placeholder="$t('itemHold.quantityPlaceholder')" />
        </div>
      </template>
    </card>
    <div class="w-full flex justify-end">
      <div class="flex gap-4 mt-5 w-1/2">
        <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'OpeningBalance' }" />
        <BaseButton type="submit" label="button.save" variant="primary" block />
      </div>
    </div>
  </div>
</template>
