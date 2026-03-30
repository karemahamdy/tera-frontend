<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { LDCSchema } from "../validation/ProductionReceiptsSchema";
import router from "@/app/router";
import { useProductionReceipts } from "../composables/useProductionReceipts";

const props = defineProps<{
  mode: "edit" | "create" | "view";
  id?: string;
}>();

const editMode = props.mode === "edit";
const viewMode = props.mode === "view";
const isSubmitting = ref(false);
const { updateProductionReceipts, createProductionReceipts } = useProductionReceipts();

type LDCFormValues = {
  code: string;
  department: string;
  name: string;
  notes: string | null;
  isActive: boolean;
};

const initialValues: LDCFormValues = {
  code: "",
  department: "",
  name: "",
  notes: null,
  isActive: true,
};

const { errors, defineField, handleSubmit } = useForm<LDCFormValues>({
  validationSchema: LDCSchema,
  initialValues,
});

const [code] = defineField("code");
const [name] = defineField("name");
const [department] = defineField("department");
const [isActive] = defineField("isActive");

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  if (viewMode) return;

  try {
    if (editMode && props.id) {
      await updateProductionReceipts(props.id, values);
    } else {
      await createProductionReceipts(values);
    }
    router.push({
      name: "ProductionReceipts",

    });
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
});
</script>


<template>
  <div>
        <form form @submit.prevent="onSubmit" class="space-y-6">
          <p class="font-bold mb-5 text-lg">
            {{ $t("ProductionReceipts.ProductionReceiptDetails") }}
          </p>

          <div class="grid grid-cols-2 gap-4">
            <FormInput :label="$t('ProductionReceipts.ReceiptNo')" v-model="code"
              :placeholder="$t('WO-2024-001')" :error="errors.code" :invalid="!!errors.code" />
            <div class="w-full">
              <label class="block text-gray-600 text-lg font-bold">{{ $t("ProductionReceipts.date") }}</label>
              <DatePicker showIcon fluid iconDisplay="input" :placeholder="$t('ProductionReceipts.datePlaceholder')" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('ProductionReceipts.WorkOrder')" v-model="code"
              :placeholder="$t('ProductionReceipts.WorkOrderPlaceholder')" :error="errors.code" :invalid="!!errors.code" />
            <FormInput :label="$t('ProductionReceipts.item')" v-model="name" :placeholder="$t('Hydraulic Pump')"
              :error="errors.name" :invalid="!!errors.name" />
          </div>

          <div class="">
            
            <FormInput :label="$t('ProductionReceipts.quantity')" v-model="department"
              :placeholder="$t('ProductionReceipts.quantityPlaceholder')" :error="errors.department"
              :invalid="!!errors.department" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('ProductionReceipts.WarehouseIn')" v-model="code"
              :placeholder="$t('ProductionReceipts.WarehouseInPlaceholder')" :error="errors.code" :invalid="!!errors.code" />
            <FormDropdown :label="$t('ProductionReceipts.WarehouseOut')" v-model="name"
              :placeholder="$t('ProductionReceipts.WarehouseOutPlaceholder')" :error="errors.name" :invalid="!!errors.name" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormInput :label="$t('ProductionReceipts.DownTime')" v-model="department"
              :placeholder="$t('ProductionReceipts.DownTimePlaceholder')" :error="errors.department"
              :invalid="!!errors.department" />
              <FormDropdown :label="$t('ProductionReceipts.DownTimeType')" v-model="department"
              :placeholder="$t('ProductionReceipts.DownTimeTypePlaceholder')" :error="errors.department"
              :invalid="!!errors.department" />
          </div>

        </form>
  </div>
</template>

<style scoped></style>