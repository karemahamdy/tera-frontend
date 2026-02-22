<script setup lang="ts">
</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="OpeningBalance.editOpeningBalance" />
    <card class="bg-white rounded-[10px]">
      <!-- PageHeader component -->
      <template #title>
        <PageHeader title="OpeningBalance.editOpeningBalance" subtitle="OpeningBalance.createOpeningBalanceInfo"
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

          <FormDropdown class="w-full mt-5" :label="$t('OpeningBalance.zone')" :options="[]" optionValue="value"
            :placeholder="$t('OpeningBalance.zone')" />

          <FormInput :label="$t('OpeningBalance.date')" type="date" class="mt-5" :placeholder="$t('Date')" />
          <FormDropdown class="w-full mt-5" :label="$t('OpeningBalance.uom')" :options="[]" optionValue="value"
            :placeholder="$t('OpeningBalance.Uom')" />

          <FormInput :label="$t('OpeningBalance.UnitCost')" class="mt-5" :placeholder="$t('OpeningBalance.UnitCost')" />

          <FormInput :label="$t('itemHold.quantity')" class="mt-5" :placeholder="$t('itemHold.quantityPlaceholder')" />

          <div class="w-full mt-5 col-span-2">
          <label class="text-gray-700 font-medium mb-2 block">
            {{ $t("itemTransaction.notes") }}
          </label>

          <Textarea
            :placeholder="$t('itemTransaction.notesPlaceholder')"
            class="mt-1 w-full p-3 border rounded-lg"
            rows="3"
          />
        </div>
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
