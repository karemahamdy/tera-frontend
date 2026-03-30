<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import router from "@/app/router";
import { useworkOrder } from "@/modules/Production/Transaction/work-order/composables/useWorkOrder";
import { LDCSchema } from "../validation/BOMSchema";

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
const [notes] = defineField("notes");

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
        {{ $t("BOM.HeaderInformation") }}
      </p>

      <div class="grid grid-cols-2 gap-4">
        <FormInput :label="$t('BOM.code')" v-model="code" :placeholder="$t('WO-2024-001')" :error="errors.code"
          :invalid="!!errors.code" />
        <FormInput :label="$t('BOM.name')" v-model="name" :placeholder="$t('BOM.namePlaceholder')" :error="errors.name"
          :invalid="!!errors.name" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <FormInput :label="$t('BOM.versions')" v-model="department" :placeholder="$t('BOM.VersionPlaceholder')"
          :error="errors.department" :invalid="!!errors.department" />
        <FormInput :label="$t('BOM.quantity')" v-model="department" :placeholder="$t('BOM.quantityPlaceholder')"
          :error="errors.department" :invalid="!!errors.department" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <FormDropdown :label="$t('BOM.FinalProduct')" v-model="name" :placeholder="$t('BOM.FinalProductPlaceholder')"
          :error="errors.name" :invalid="!!errors.name" />
        <FormInput :label="$t('workOrder.UOM')" v-model="code" :placeholder="$t('workOrder.UOMPlaceholder')"
          :error="errors.code" :invalid="!!errors.code" />
      </div>
      <ToggleItem :title="$t('status')" :label="$t('BOM.ActiveBOM')" v-model="isActive" />
      <div>
        <label class="text-gray-700 font-medium mb-2 block">
          {{ $t("downtime.notes") }}
        </label>
        <Textarea v-model="notes" :placeholder="$t('BOM.notesPlaceholder')"
          class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.notes }"
          :disabled="isSubmitting" />
        <small v-if="errors.notes" class="text-danger-500">
          {{ $t(errors.notes) }}
        </small>
      </div>

    </form>
  </div>
</template>

<style scoped></style>