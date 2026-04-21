<script setup lang="ts">
import { computed, ref } from "vue";
import { useForm } from "vee-validate";
import { useworkOrder } from "@/modules/Production/Transaction/work-order/composables/useWorkOrder";
import { LDCSchema } from "../validation/BOMSchema";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
  mode: "edit" | "create";
  id?: string;
}>();

const editMode = props.mode === "edit";
const isSubmitting = ref(false);
const router = useRouter();
const route = useRoute();
const { createworkOrder, updateworkOrder } = useworkOrder();
const isCreate = computed(() => route.name === 'BOMCreate')

type LDCFormValues = {
  bomCode: string;
  bomName: string;
  parentItemId: string;
  baseQuantity: number;
  notes: string | null;
  isActive: boolean;
  version: string;
};

const initialValues: LDCFormValues = {
  bomCode: "",
  bomName: "",
  parentItemId: "",
  baseQuantity: 1,
  notes: null,
  isActive: true,
  version: "Version 1",
};

const { errors, defineField, handleSubmit } = useForm<LDCFormValues>({
  validationSchema: LDCSchema,
  initialValues,
});

const [bomCode] = defineField("bomCode");
const [bomName] = defineField("bomName");
// const [parentItemId] = defineField("parentItemId");
const [baseQuantity] = defineField("baseQuantity");
const [notes] = defineField("notes");
const [isActive] = defineField("isActive");
const [version] = defineField("version");

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
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
        <FormInput :label="$t('BOM.code')" v-model="bomCode" :placeholder="$t('WO-2024-001')" :error="errors.bomCode"
          :invalid="!!errors.bomCode" />
        <FormInput :label="$t('BOM.name')" v-model="bomName" :placeholder="$t('BOM.namePlaceholder')" :error="errors.bomName"
          :invalid="!!errors.bomName" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <FormInput :label="$t('BOM.versions')" v-model="version" :placeholder="$t('Version 1')"
          :error="errors.version" :invalid="!!errors.version" disabled/>
        <FormInput :label="$t('BOM.BaseQuantity')" v-model="baseQuantity" :placeholder="$t('BOM.quantityPlaceholder')"
          :error="errors.baseQuantity" :invalid="!!errors.baseQuantity" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <FormDropdown :label="$t('BOM.FinalProduct')" v-model="bomName" :placeholder="$t('BOM.FinalProductPlaceholder')"
          :error="errors.bomName" :invalid="!!errors.bomName" />
        <FormInput :label="$t('BOM.BaseUOM')" v-model="bomCode" :placeholder="$t('workOrder.UOMPlaceholder')"
          :error="errors.bomCode" :invalid="!!errors.bomCode" />
      </div>
      <ToggleItem :title="$t('BOM.BOMStatus')" :label="$t('BOM.ActiveBOM')" v-model="isActive" :disabled="isCreate" />
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