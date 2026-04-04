<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from "@/assets/images/alert.png";
import { useLookups } from "@/composables/useLookups";
import { onMounted, computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { ItemTransactionsSchema } from "../validation/ItemTransactionsSchema";
import { useItemTransactions } from "../composables/useItemTransactions";
const { createItemTransactions, getItemInformations, validateItems } =
  useItemTransactions();
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

const showDialog = ref<boolean>(false);
const dialogMsg = ref<string | null>(null);
const dialogData = ref<MergeOrTransferTransactionsPayload | null>(null);

const [mergeTransfareType] = defineField("mergeTransfareType");
const [warehouseId] = defineField("warehouseId");
const [notes] = defineField("notes");
const [sourceItemId] = defineField("sourceItemId");
const [targetItemId] = defineField("targetItemId");

const sourceItemDetails = ref({
  totalQuantity: 0,
  locations: 0,
  transactions: 0,
});

const targetItemDetails = ref({
  totalQuantity: 0,
  locations: 0,
  transactions: 0,
});

const loadSourceItemDetails = async () => {
  const itemDetails = await getItemInformations(
    sourceItemId.value,
    warehouseId.value,
  );

  sourceItemDetails.value = {
    totalQuantity: itemDetails.totalQuantity,
    locations: itemDetails.locations,
    transactions: itemDetails.transaction,
  };
};

const loadTargetItemDetails = async () => {
  const itemDetails = await getItemInformations(
    targetItemId.value,
    warehouseId.value,
  );

  targetItemDetails.value = {
    totalQuantity: itemDetails.totalQuantity,
    locations: itemDetails.locations,
    transactions: itemDetails.transaction,
  };
};

const loadSourceTargetItemDetails = async () => {
  await Promise.all([loadSourceItemDetails(), loadTargetItemDetails()]);
};

const transactionTypes = computed(() => {
  return [
    { label: t("operation.merge"), value: "ItemMerge" },
    { label: t("operation.transfer"), value: "TransferTransactions" },
  ];
});

const onSubmit = handleSubmit(
  async (values: MergeOrTransferTransactionsPayload) => {
    const res = await validateItems(values.sourceItemId, values.targetItemId);
    if (res.status) {
      createItemTransactions(values);
    } else {
      showDialog.value = true;
      dialogMsg.value = res.msg;
      dialogData.value = values;
    }
  },
);

const handleConfirm = () => {
  showDialog.value = false;
  if (dialogData.value) {
    createItemTransactions(dialogData.value);
  }
};

const handleTransferTypeChange = (value: string) => {
  mergeTransfareType.value = value;

  if (value !== "ItemTransfer") {
    warehouseId.value = "";
  }
};

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
              @update:modelValue="handleTransferTypeChange"
            />

            <FormDropdown
              v-if="mergeTransfareType == 'ItemTransfer'"
              class="w-full"
              :label="$t('items.warehouse')"
              @update:modelValue="loadSourceTargetItemDetails"
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
                  :label="$t('itemTransaction.sourceItem')"
                  :options="itemLookups"
                  v-model="sourceItemId"
                  :error="errors.sourceItemId"
                  optionValue="value"
                  @update:modelValue="loadSourceItemDetails"
                  :placeholder="$t('itemTransaction.sourceItemSelect')"
                />
                <div
                  v-if="mergeTransfareType === 'TransferTransactions'"
                  class="mt-3 p-5 bg-primary-25 rounded-xl"
                >
                  <p class="text-lg">
                    <strong>{{
                      $t("itemTransaction.sourceItemDetails")
                    }}</strong>
                  </p>
                  <div class="text-sm">
                    <p>
                      {{ $t("itemTransaction.totalQuantity")
                      }}{{ sourceItemDetails?.totalQuantity }}
                    </p>
                    <p>
                      {{ $t("itemTransaction.locations")
                      }}{{ sourceItemDetails.locations }}
                    </p>
                    <p>
                      {{ $t("itemTransaction.transactions")
                      }}{{ sourceItemDetails.transactions }}
                    </p>
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
                  :label="$t('itemTransaction.targetItem')"
                  :options="itemLookups"
                  v-model="targetItemId"
                  optionValue="value"
                  :error="errors.targetItemId"
                  @update:modelValue="loadTargetItemDetails"
                  :placeholder="$t('itemTransaction.targetItemSelect')"
                />
                <div
                  v-if="mergeTransfareType === 'TransferTransactions'"
                  class="mt-3 p-5 bg-primary-25 rounded-xl"
                >
                  <p class="text-lg">
                    <strong>{{
                      $t("itemTransaction.targetItemDetails")
                    }}</strong>
                  </p>
                  <div class="text-sm">
                    <p>
                      {{ $t("itemTransaction.totalQuantity")
                      }}{{ targetItemDetails.totalQuantity }}
                    </p>
                    <p>
                      {{ $t("itemTransaction.locations")
                      }}{{ targetItemDetails.locations }}
                    </p>
                    <p>
                      {{ $t("itemTransaction.transactions")
                      }}{{ targetItemDetails.transactions }}
                    </p>
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
              v-model="notes"
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
    </form>

    <StatusDialog
      v-model:visible="showDialog"
      :icon="alertIcon"
      :title="dialogMsg"
      :buttons="[
        { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
        { label: $t('button.create'), variant: 'danger', action: 'confirm' },
      ]"
      @confirm="handleConfirm"
    />
  </div>
</template>
