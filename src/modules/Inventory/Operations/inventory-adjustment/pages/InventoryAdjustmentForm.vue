<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useLookups } from "@/composables/useLookups";
const { adjustmentReasonLookups, getAdjustmentReasonLookups } = useLookups();
const { t } = useI18n();
import { useForm } from "vee-validate";
import { InventoryAdjustmentSchema } from "../validation/InventoryAdjustmentSchema";
import { useInventoryAdjustment } from "../composables/useInventoryAdjustment";
const { createInventoryAdjustment, getPhysicalCountsForAdjustmentByItem, PhysicalCountsForAdjustmentByItem } = useInventoryAdjustment();
import type { CreateInventoryAdjustmentPayload } from "../types/InventoryAdjustment";

const { handleSubmit, errors, defineField } = useForm<CreateInventoryAdjustmentPayload>({
  validationSchema: InventoryAdjustmentSchema,
  initialValues: {
    adjustmentNumber: "",
    adjustmentReason: "",
    physicalCountHeaderIds: [],
    notes: "",
  },
});

const [adjustmentNumber] = defineField("adjustmentNumber");
const [adjustmentReason] = defineField("adjustmentReason");
const [notes] = defineField("notes");
const [physicalCountHeaderIds] = defineField("physicalCountHeaderIds");

const props = defineProps<{
  mode: "view" | "create";
}>();

const columns = computed(() => {
  const Columns = [
    { field: "countedCode", header: t("InventoryAdjustment.countID") },
    { field: "itemName", header: t("InventoryAdjustment.item") },
    { field: "warehouseName", header: t("operation.warehouse") },
    {
      field: "availableBalance",
      header: t("InventoryAdjustment.availableBalance"),
    },
    { field: "countedQuantity", header: t("InventoryAdjustment.counted") },
    { field: "variance", header: t("InventoryAdjustment.variance") },
  ];

  return Columns;
});


const onSubmit = handleSubmit(
  async (values: CreateInventoryAdjustmentPayload) => {
    createInventoryAdjustment(values);
  },
);

onMounted(() => {
  Promise.all([getAdjustmentReasonLookups(), getPhysicalCountsForAdjustmentByItem()]);
});
</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="InventoryAdjustment.InventoryAdjustment" />
    <form @submit.prevent="onSubmit">
      <card class="bg-white rounded-[10px]">
        <!-- PageHeader component -->
        <template #title>
          <PageHeader title="InventoryAdjustment.createNewAdjustment" subtitle="InventoryAdjustment.subtitle"
            :showSearch="false" />
        </template>
        <!-- DynamicTable component -->
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput class="w-full" :label="$t('InventoryAdjustment.adjustmentNumber')" v-model="adjustmentNumber"
              :error="errors.adjustmentNumber" :placeholder="$t('InventoryAdjustment.adjustmentNumber')" />
            <FormDropdown class="w-full" :label="$t('InventoryAdjustment.reason')" :options="adjustmentReasonLookups"
              v-model="adjustmentReason" :error="errors.adjustmentReason" optionValue="value"
              :placeholder="$t('InventoryAdjustment.reason')" />
          </div>
          <div class="my-5">
            <p class="text-xl">
              <strong>{{
                $t("InventoryAdjustment.selectItemToAdjustment")
              }}</strong>
            </p>
          </div>
          <div>
            <DynamicTable :columns="columns" :data="PhysicalCountsForAdjustmentByItem" dataKey="countedId"
              v-model:selectedRows="physicalCountHeaderIds" :paginator="false" hasSelection />
            <div>
              <small v-if="errors.physicalCountHeaderIds" class="text-danger-500">
                {{ $t(errors.physicalCountHeaderIds) }}
              </small>
            </div>
          </div>

          <div class="w-full mt-5">
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("itemTransaction.notes") }}
            </label>

            <Textarea v-model="notes" :placeholder="$t('itemTransaction.notesPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="3" />
          </div>
        </template>
      </card>
      <div class="w-full flex justify-end">
        <div class="flex gap-4 mt-5 w-1/2">
          <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'BranchManagement' }" />
          <BaseButton type="submit" label="InventoryAdjustment.createAdjustment" variant="primary" block />
        </div>
      </div>
    </form>
  </div>
</template>
