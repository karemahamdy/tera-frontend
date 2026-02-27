<script setup lang="ts">
import OpeningBalanceInfo from '../components/OpeningBalanceInfo.vue';
import { useOpeningBalance } from "../composables/useOpeningBalance";
const { handleSubmit, updateOpeningBalance } = useOpeningBalance();
import { useRoute } from "vue-router";
const route = useRoute();
const id = route.params.id as string;

const onSubmit = handleSubmit(
  (values) => {
    if (id) {
      updateOpeningBalance(id, values);
    }
  },
);
</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="OpeningBalance.editOpeningBalance" />
    <form @submit.prevent="onSubmit">
      <card class="bg-white rounded-[10px]">
        <!-- DynamicTable component -->
        <template #content>
          <OpeningBalanceInfo title="OpeningBalance.editOpeningBalance"
            subtitle="OpeningBalance.createOpeningBalanceInfo" />
        </template>
      </card>
      <div class="w-full flex justify-end">
        <div class="flex gap-4 mt-5 w-1/2">
          <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'OpeningBalance' }" />
          <BaseButton type="submit" label="button.save" variant="primary" block />
        </div>
      </div>
    </form>
  </div>
</template>
