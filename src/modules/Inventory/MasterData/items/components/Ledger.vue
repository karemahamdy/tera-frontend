<script setup lang="ts">
import { useItems } from "../composables/useItems";
const { errors } = useItems();
</script>
<template>
  <div>
    <div>
      <p class="font-bold mb-5 mt-10 text-lg">
        {{ $t("items.ledger") }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormDropdown
          class="w-full"
          :label="$t('items.ledgerDetailCard')"
          :options="[]"
          :error="errors.branchID"
          optionValue="value"
          :placeholder="$t('items.selectLedgerDetailCard')"
        />
        <FormDropdown
          class="w-full"
          :label="$t('items.costCenter')"
          :options="[]"
          :error="errors.branchID"
          optionValue="value"
          :placeholder="$t('items.selectDefaultCostCenter')"
        />
      </div>
    </div>
  </div>
</template>
