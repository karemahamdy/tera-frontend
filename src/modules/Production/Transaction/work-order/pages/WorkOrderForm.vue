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
const [notes] = defineField("notes");
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
  <ScreenHeader title="production" subtitle="masterData" :actionName="editMode ? $t('workCenter.editWorkCenterInfo') : $t('workCenter.createWorkCenterInfo')"  />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("workCenter.editWorkCenterInfo") : $t("workCenter.createWorkCenterInfo") }}
          </h2>
          <p class="subheading-title">
            {{ editMode ? $t("workCenter.editWorkCenterInfoDesc") : $t("workCenter.createWorkCenterInfoDesc") }}
          </p>
        </div>
      </template>

      <template #content>
        <form form @submit.prevent="onSubmit" class="space-y-6 px-20">

          <div class="grid grid-cols-2 gap-4">  
            <FormInput :label="$t('workCenter.workCentercode')" v-model="code" :placeholder="$t('workCenter.codePlaceholder')"
              :error="errors.code" :invalid="!!errors.code" :disabled="viewMode" />
               <FormInput :label="$t('workCenter.workCentername')" v-model="name" :placeholder="$t('workCenter.namePlaceholder')"
              :error="errors.name" :invalid="!!errors.name" :disabled="viewMode" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('workCenter.department')" v-model="department" :placeholder="$t('workCenter.departmentPlaceholder')"
              :error="errors.department" :invalid="!!errors.department" :disabled="viewMode" />
           <ToggleItem :title="$t('status')" :label="$t('button.active')" v-model="isActive" />
          </div>

          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("workCenter.notes") }}
            </label>
            <Textarea v-model="notes" :placeholder="$t('workCenter.notesPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.notes }"
              :disabled="isSubmitting" />
            <small v-if="errors.notes" class="text-danger-500">
              {{ $t(errors.notes) }}
            </small>
          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'WorkCenters' }" :disabled="isSubmitting" />
            <BaseButton type="submit" v-if="!viewMode" :label="editMode ? 'button.save' : 'button.create'"
              variant="primary" block :disabled="isSubmitting" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>