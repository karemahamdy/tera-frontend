<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { LDCSchema } from "../validation/WorkOrderSchema";
import router from "@/app/router";
import { useworkOrder } from "../composables/useWorkOrder";

const props = defineProps<{
  mode: "edit" | "create" | "view";
  id?: string;
}>();

const editMode = props.mode === "edit";
const viewMode = props.mode === "view";
const isSubmitting = ref(false);
const { createworkOrder, updateworkOrder } = useworkOrder();

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
      await updateworkOrder(props.id, values);
    } else {
      await createworkOrder(values);
    }
    router.push({
      name: "workOrder",

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
            {{ $t("workOrder.workOrderDetails") }}
          </p>

          <div class="grid grid-cols-2 gap-4">
            <FormInput :label="$t('workOrder.workOrderNumber')" v-model="code"
              :placeholder="$t('workOrder.workOrderNumberPlaceholder')" :error="errors.code" :invalid="!!errors.code" />
            <div class="w-full">
              <label class="block text-gray-600 text-lg font-bold">{{ $t("downtime.date") }}</label>
              <DatePicker showIcon fluid iconDisplay="input" :placeholder="$t('downtime.datePlaceholder')" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('workOrder.salesOrder')" v-model="code"
              :placeholder="$t('workOrder.salesOrderPlaceholder')" :error="errors.code" :invalid="!!errors.code" />
            <FormDropdown :label="$t('workOrder.item')" v-model="name" :placeholder="$t('workOrder.itemPlaceholder')"
              :error="errors.name" :invalid="!!errors.name" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormInput :label="$t('workOrder.UOM')" v-model="department" :placeholder="$t('workOrder.UOMPlaceholder')"
              :error="errors.department" :invalid="!!errors.department" />
            <FormInput :label="$t('workOrder.quantity')" v-model="department"
              :placeholder="$t('workOrder.quantityPlaceholder')" :error="errors.department"
              :invalid="!!errors.department" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('workOrder.WarehouseIn')" v-model="code"
              :placeholder="$t('workOrder.WarehouseInPlaceholder')" :error="errors.code" :invalid="!!errors.code" />
            <FormDropdown :label="$t('workOrder.WarehouseOut')" v-model="name"
              :placeholder="$t('workOrder.WarehouseOutPlaceholder')" :error="errors.name" :invalid="!!errors.name" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('workOrder.RelatedWorkOrder')" v-model="department"
              :placeholder="$t('workOrder.RelatedWorkOrderPlaceholder')" :error="errors.department"
              :invalid="!!errors.department" />
            <div class="w-full">
              <label class="block text-gray-700 text-lg font-bold">{{ $t("workOrder.Plannedstart") }}</label>
              <DatePicker showIcon fluid iconDisplay="input" :placeholder="$t('workOrder.PlannedstartPlaceholder')" />
            </div>
          </div>

          <ToggleItem :title="$t('status')" :label="$t('button.active')" v-model="isActive" />

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'WorkCenters' }"
              :disabled="isSubmitting" />
            <BaseButton type="submit" v-if="!viewMode" :label="editMode ? 'button.save' : 'button.create'"
              variant="primary" block :disabled="isSubmitting" :loading="isSubmitting" />
          </div>
        </form>
  </div>
</template>

<style scoped></style>