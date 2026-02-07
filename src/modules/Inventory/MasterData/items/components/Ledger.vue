<script setup lang="ts">
import { useItems } from "../composables/useItems";
const { errors, ledgerDetailCardID, costCenterID } = useItems();
import { onMounted } from "vue";
import { useLookups } from "@/composables/useLookups";
const {
  ledgerDetailCardLookups,
  getLedgerDetailCardLookups,
  costcenterLookups,
  getCostcenterLookups,
} = useLookups();

onMounted(() => {
  Promise.all([(getLedgerDetailCardLookups(), getCostcenterLookups())]);
});
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
          :options="ledgerDetailCardLookups"
          v-model="ledgerDetailCardID"
          :error="errors.ledgerDetailCardID"
          optionValue="value"
          :placeholder="$t('items.selectLedgerDetailCard')"
        />
        <FormDropdown
          class="w-full"
          :label="$t('items.costCenter')"
          :options="costcenterLookups"
          v-model="costCenterID"
          :error="errors.costCenterID"
          optionValue="value"
          :placeholder="$t('items.selectDefaultCostCenter')"
        />
      </div>
    </div>
  </div>
</template>
