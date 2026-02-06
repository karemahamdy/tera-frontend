<script setup lang="ts">
import { onMounted } from "vue";
import { useItems } from "../composables/useItems";
const {
  errors,
  defaultCurrencyID,
  taxesID,
  multipleCurrency,
  standardCost,
  salesPrice,
  lastPurchasePrice,
  lastMovingAverage,
} = useItems();
import { useLookups } from "@/composables/useLookups";

const { currencyLookups, getCurrencyLookups, taxLookups, getTaxLookups } =
  useLookups();

onMounted(() => {
  Promise.all([(getCurrencyLookups(), getTaxLookups())]);
});
</script>
<template>
  <div>
    <div>
      <p class="font-bold mb-5 text-lg">{{ $t("items.pricingInformation") }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormDropdown
          class="w-full"
          :label="$t('items.defaultCurrency')"
          :options="currencyLookups"
          v-model="defaultCurrencyID"
          :error="errors.defaultCurrencyID"
          optionValue="value"
          :placeholder="$t('items.defaultCurrencyPlaceholder')"
        />
        <FormDropdown
          class="w-full"
          :label="$t('items.taxes')"
          :options="taxLookups"
          v-model="taxesID"
          :error="errors.taxesID"
          optionValue="value"
          :placeholder="$t('items.taxesPlaceholder')"
        />
        <div class="w-full md:col-span-2">
          <p class="font-bold mb-5">{{ $t("items.multipleCurrency") }}</p>
          <div class="w-full flex flex-wrap gap-1 justify-between items-center">
            <div
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-300"
            >
              <Checkbox
                v-model="multipleCurrency"
                inputId="inputId"
                binary
                @click.stop
              />
              <label class="font-medium cursor-pointer" for="inputId">
                {{ $t("items.allowMultipleCurrency") }}
              </label>
            </div>
          </div>
        </div>
        <FormInput
          :label="$t('items.standardCost')"
          :error="errors.standardCost"
          type="number"
          v-model="standardCost"
          :placeholder="$t('items.standardCostPlaceholder')"
          :invalid="!!errors.standardCost"
        />
        <FormInput
          :label="$t('items.salesPrice')"
          :error="errors.salesPrice"
          type="number"
          v-model="salesPrice"
          :placeholder="$t('items.salesPricePlaceholder')"
          :invalid="!!errors.salesPrice"
        />
        <FormInput
          :label="$t('items.lastPurchasePrice')"
          :error="errors.lastPurchasePrice"
          type="number"
          v-model="lastPurchasePrice"
          :placeholder="$t('items.lastPurchasePricePlaceholder')"
          :invalid="!!errors.lastPurchasePrice"
        />
        <FormInput
          :label="$t('items.lastMovingAverage')"
          :error="errors.lastMovingAverage"
          type="number"
          v-model="lastMovingAverage"
          :placeholder="$t('items.lastMovingAveragePlaceholder')"
          :invalid="!!errors.lastMovingAverage"
        />
      </div>
    </div>
  </div>
</template>
