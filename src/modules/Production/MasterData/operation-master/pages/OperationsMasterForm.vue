<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { OperationsMasterSchema } from "../validation/OperationsMasterSchema";
import { useOperationsMaster } from "../composables/useOperationsMaster";
import router from "@/app/router";

const props = defineProps<{
  mode: "edit" | "create" | "view";
  id?: string;
}>();

const editMode = props.mode === "edit";
const viewMode = props.mode === "view";
const isSubmitting = ref(false);
const { createOperationsMaster, updateOperationsMaster, fetchOperationsMasterById } = useOperationsMaster();

type OperationsMasterValues = {
  processCode: string;
  processName: string;
  laborCostPerHour: number | null;
  overheadPercentage: number | null;
  description: string | null;
  isActive: boolean;
} 

const initialValues: OperationsMasterValues = {
  processCode: "",
  processName: "",
  laborCostPerHour: null,
  overheadPercentage: null,
  description: null,
  isActive: true,
};

const { errors, defineField, handleSubmit , setValues} = useForm<OperationsMasterValues>({
  validationSchema: OperationsMasterSchema,
  initialValues,
});

const [processCode] = defineField("processCode");
const [laborCostPerHour] = defineField("laborCostPerHour");
const [description] = defineField("description");
const [processName] = defineField("processName");
const [overheadPercentage] = defineField("overheadPercentage");
const [isActive] = defineField("isActive");

onMounted(async () => {
  
  if (editMode && props.id || viewMode && props.id) {
    const data = await fetchOperationsMasterById(props.id);
    if (data) {
      const mappedValues: OperationsMasterValues = {
        processName: data.processName ?? null,
        processCode: data.processCode ?? null,
        laborCostPerHour: data.laborCostPerHour ?? null,
        overheadPercentage: data.overheadPercentage ?? null,
        description: data.description ?? null,
        isActive  : data.isActive   ?? null,
      };
        setValues(mappedValues);
    }
  }
});


const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    if (editMode && props.id) {
      await updateOperationsMaster(props.id, values);
    } else {
      await createOperationsMaster(values);
    }
    router.push({
      name: "OperationsMaster",
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
    <ScreenHeader title="production" subtitle="masterData"
      :actionName="editMode ? $t('OperationsMaster.editOperationsMasterInfo') : $t('OperationsMaster.createOperationsMasterInfo')" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("OperationsMaster.editOperationsMasterInfo") : $t("OperationsMaster.createOperationsMasterInfo") }}
          </h2>
          <p class="subheading-title">
            {{ editMode ? $t("OperationsMaster.editOperationsMasterInfoDesc") : $t("OperationsMaster.createOperationsMasterInfoDesc") }}
          </p>
        </div>
      </template>

      <template #content>
        <form form @submit.prevent="onSubmit" class="space-y-6 px-20">

          <div class="grid grid-cols-2 gap-4">
            <FormInput :label="$t('OperationsMaster.code')" v-model="processCode"
              :placeholder="$t('OperationsMaster.operationCodePlaceholder')" :error="errors.processCode" :invalid="!!errors.processCode"
              :disabled="viewMode" />
            <FormInput :label="$t('OperationsMaster.name')" v-model="processName"
              :placeholder="$t('OperationsMaster.operationNamePlaceholder')" :error="errors.processName" :invalid="!!errors.processName"
              :disabled="viewMode" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormInput :label="$t('OperationsMaster.laborCost')" v-model="laborCostPerHour"
              :placeholder="$t('OperationsMaster.laborCostPlaceholder')" :error="errors.laborCostPerHour"
              :invalid="!!errors.laborCostPerHour" :disabled="viewMode" />
            <FormInput :label="$t('OperationsMaster.Overhead')" v-model="overheadPercentage"
              :placeholder="$t('OperationsMaster.overheadPlaceholder')" :error="errors.overheadPercentage" :invalid="!!errors.overheadPercentage"
              :disabled="viewMode" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-gray-700 font-medium mb-2 block">
                {{ $t("OperationsMaster.description") }}
              </label>
              <Textarea v-model="description" :placeholder="$t('OperationsMaster.descriptionPlaceholder')"
                class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.description }"
                :disabled="isSubmitting" />
              <small v-if="errors.description" class="text-danger-500">
                {{ $t(errors.description) }}
              </small>
            </div>
             <ToggleItem :title="$t('status')" :label="$t('button.active')" v-model="isActive" />
          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'OperationsMaster' }"
              :disabled="isSubmitting" />
            <BaseButton type="submit" v-if="!viewMode" :label="editMode ? 'button.save' : 'button.create'"
              variant="primary" block :disabled="isSubmitting" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>