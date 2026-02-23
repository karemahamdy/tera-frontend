<script setup lang="ts">
import { useLookups } from "@/composables/useLookups";
import { onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { ItemTransactionsSchema } from "../validation/ItemTransactionsSchema";
import { useItemTransactions } from "../composables/useItemTransactions";
const { createItemTransactions } = useItemTransactions();
import type { MergeOrTransferTransactionsPayload } from "../types/ItemTransactions";

import { useForm } from "vee-validate";

const { warehouseLookup, getWarehouseLookups, itemLookups, getItemLookups } =
  useLookups();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: ItemTransactionsSchema,
  initialValues: {
    mergeTransfareType: "ItemMerge",
    warehouseId: "",
    notes: "",
    sourceItemId: "",
    targetItemId: "",
  },
});

const [mergeTransfareType] = defineField("mergeTransfareType");
const [warehouseId] = defineField("warehouseId");
const [notes] = defineField("notes");
const [sourceItemId] = defineField("sourceItemId");
const [targetItemId] = defineField("targetItemId");

const transactionTypes = computed(() => {
  return [
    { label: t("operation.merge"), value: "ItemMerge" },
    { label: t("operation.transfer"), value: "ItemTransfer" },
  ];
});

const onSubmit = handleSubmit(
  async (values: MergeOrTransferTransactionsPayload) => {
    createItemTransactions(values);
  },
);

onMounted(() => {
  Promise.all([(getWarehouseLookups(), getItemLookups())]);
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader
      title="inventory"
      subtitle="operation.title"
      actionName="operation.itemTransactions"
    />
    <form @submit.prevent="onSubmit">
      <card class="bg-white rounded-[10px]">
        <!-- PageHeader component -->
        <template #title>
          <PageHeader
            title="itemTransaction.createNewTransaction"
            subtitle="itemTransaction.newTransactionDescription"
            :showSearch="false"
          />
        </template>
        <template #content>
          <div
            :class="{
              'grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2':
                mergeTransfareType == 'ItemTransfer',
            }"
          >
            <FormDropdown
              class="w-full"
              :label="$t('itemTransaction.transactionType')"
              :options="transactionTypes"
              v-model="mergeTransfareType"
              optionValue="value"
              :error="errors.mergeTransfareType"
              :placeholder="$t('itemTransaction.selectTransactionType')"
            />

            <FormDropdown
              v-if="mergeTransfareType == 'ItemTransfer'"
              class="w-full"
              :label="$t('items.warehouse')"
              :options="warehouseLookup"
              v-model="warehouseId"
              :error="errors.warehouseId"
              optionValue="value"
              :placeholder="$t('items.warehousePlaceholder')"
            />
          </div>

          <div class="mt-5">
            <p>
              <strong>{{ $t("itemTransaction.sourceTargetItems") }}</strong>
            </p>
            <div class="grid grid-cols-9 justify-center items-center gap-2">
              <div class="col-span-4 bg-primary-50 rounded-xl p-5">
                <p class="text-primary-500">
                  <strong>{{ $t("itemTransaction.sourceItemFrom") }}</strong>
                </p>
                <FormDropdown
                  class="w-full mt-3"
                  :label="$t('itemTransaction.sourceItemId')"
                  :options="itemLookups"
                  v-model="sourceItemId"
                  :error="errors.sourceItemId"
                  optionValue="value"
                  :placeholder="$t('itemTransaction.sourceItemSelect')"
                />
                <div
                  v-if="mergeTransfareType === 'ItemTransfer'"
                  class="mt-3 p-5 bg-primary-25 rounded-xl"
                >
                  <p class="text-lg">
                    <strong>{{
                      $t("itemTransaction.sourceItemDetails")
                    }}</strong>
                  </p>
                  <div class="text-sm">
                    <p>{{ $t("itemTransaction.totalQuantity") }}0</p>
                    <p>{{ $t("itemTransaction.locations") }}0</p>
                    <p>{{ $t("itemTransaction.transactions") }}0</p>
                  </div>
                </div>
              </div>
              <div class="col-span-1 flex justify-center items-center h-full">
                <div class="p-3 rounded-full bg-primary-500 text-white">
                  <VsxIcon
                    v-if="mergeTransfareType === 'ItemTransfer'"
                    iconName="ArrowSwapHorizontal"
                    type="linear"
                  />
                  <VsxIcon v-else iconName="Routing2" type="linear" />
                </div>
              </div>
              <div class="col-span-4 bg-primary-50 rounded-xl p-5">
                <p class="text-primary-500">
                  <strong>{{ $t("itemTransaction.targetItemTo") }}</strong>
                </p>
                <FormDropdown
                  class="w-full mt-3"
                  :label="$t('itemTransaction.targetItemId')"
                  :options="itemLookups"
                  v-model="targetItemId"
                  optionValue="value"
                  :error="errors.targetItemId"
                  :placeholder="$t('itemTransaction.targetItemSelect')"
                />
                <div
                  v-if="mergeTransfareType === 'ItemTransfer'"
                  class="mt-3 p-5 bg-primary-25 rounded-xl"
                >
                  <p class="text-lg">
                    <strong>{{
                      $t("itemTransaction.targetItemDetails")
                    }}</strong>
                  </p>
                  <div class="text-sm">
                    <p>{{ $t("itemTransaction.totalQuantity") }}0</p>
                    <p>{{ $t("itemTransaction.locations") }}0</p>
                    <p>{{ $t("itemTransaction.transactions") }}0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block mt-5 font-medium">
              {{ $t("itemTransaction.notes") }}
            </label>
            <Textarea
              :modelValue="notes"
              rows="2"
              class="w-full p-3 border rounded-lg"
              :placeholder="$t('itemTransaction.notesPlaceholder')"
            />
            <small v-if="errors.notes" class="text-danger-500">
              {{ $t(errors.notes) }}
            </small>
          </div>

          <div
            v-if="mergeTransfareType === 'ItemMerge'"
            class="mt-5 border border-warning-500 bg-warning-50 rounded-xl p-5"
          >
            <p class="text-warning-500 flex items-center gap-2">
              <VsxIcon iconName="InfoCircle" type="linear" />
              <strong>{{ $t("itemTransaction.irreversibleOperation") }}</strong>
            </p>
            <div class="mt-3 text-sm px-5">
              <p>{{ $t("itemTransaction.irreversibleOperation1") }}</p>
              <p>{{ $t("itemTransaction.irreversibleOperation2") }}</p>
            </div>
          </div>
        </template>
      </card>
    </form>
    <div class="w-full flex justify-end">
      <div class="flex gap-4 mt-5 w-1/2">
        <BaseButton
          label="button.cancel"
          variant="ghost"
          block
          :to="{ name: 'ItemTransactions' }"
        />
        <BaseButton
          type="submit"
          label="button.create"
          variant="primary"
          block
        />
      </div>
    </div>
  </div>
</template>
