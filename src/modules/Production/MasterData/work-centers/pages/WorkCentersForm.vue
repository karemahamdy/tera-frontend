<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { WorkCentersschema } from "../validation/WorkCentersSchema";
import { useworkCenter } from "../composables/useWorkCenters";
import router from "@/app/router";
import { useLookups } from "@/composables/useLookups";

const props = defineProps<{
  mode: "edit" | "create" | "view";
  id?: string;
}>();

const editMode = props.mode === "edit";
const viewMode = props.mode === "view";
const isSubmitting = ref(false);
const { createworkCenter, updateworkCenter, fetchworkCenterById} = useworkCenter();
const {  departmentsLookups, getDepartmentsLookups } = useLookups();  


type WorkCenterValues = {
  workCenterCode: string;
  departmentId: string;
  workCenterName: string;
  note: string | null;
  isActive: boolean;
  rowVersion?: string;
};

const initialValues: WorkCenterValues = {
  workCenterCode: "",
  departmentId: "",
  workCenterName: "",
  note: null,
  isActive: true,
};

const { errors, defineField, handleSubmit, setValues } = useForm<WorkCenterValues>({
  validationSchema: WorkCentersschema,
  initialValues,
});

const [workCenterCode] = defineField("workCenterCode");
const [workCenterName] = defineField("workCenterName");
const [note] = defineField("note");
const [departmentId] = defineField("departmentId");
const [isActive] = defineField("isActive");

onMounted(async () => {
  getDepartmentsLookups();
  if (editMode && props.id || viewMode && props.id) {
    const data = await fetchworkCenterById(props.id);
    if (data) {
      const mappedValues: WorkCenterValues = {
        workCenterName: data.workCenterName ?? null,
        workCenterCode: data.workCenterCode ?? null,
        departmentId: data.departmentId ?? null,
        rowVersion: data.rowVersion,
        note: data.note ?? null,
        isActive  : data.isActive   ?? null,
      };
        setValues(mappedValues);
    }
  }
});

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  if (viewMode) return;

  try {
    if (editMode && props.id) {
      await updateworkCenter(props.id, values);
    } else {
      await createworkCenter(values);
    }
    router.push({
      name: "WorkCenters",

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
            <FormInput :label="$t('workCenter.workCentercode')" v-model="workCenterCode" :placeholder="$t('workCenter.codePlaceholder')"
              :error="errors.workCenterCode" :invalid="!!errors.workCenterCode" :disabled="viewMode || editMode" />
               <FormInput :label="$t('workCenter.workCentername')" v-model="workCenterName" :placeholder="$t('workCenter.namePlaceholder')"
              :error="errors.workCenterName" :invalid="!!errors.workCenterName" :disabled="viewMode" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('workCenter.department')" v-model="departmentId"  :options="departmentsLookups" :placeholder="$t('workCenter.departmentPlaceholder')"
              :error="errors.departmentId" :invalid="!!errors.departmentId" :disabled="viewMode" />
           <ToggleItem :title="$t('status')" :label="$t('button.active')" v-model="isActive" />
          </div>

          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("workCenter.notes") }}
            </label>
            <Textarea v-model="note" :placeholder="$t('workCenter.notesPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.note }"
              :disabled="isSubmitting" />
            <small v-if="errors.note" class="text-danger-500">
              {{ $t(errors.note) }}
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