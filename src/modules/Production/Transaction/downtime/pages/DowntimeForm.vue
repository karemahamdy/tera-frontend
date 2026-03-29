<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { LDCSchema } from "../validation/DowntimeSchema";
import { useDowntime } from "../composables/useDowntime";
import router from "@/app/router";

const props = defineProps<{
  mode: "edit" | "create" | "view";
  id?: string;
}>();

const editMode = props.mode === "edit";
const viewMode = props.mode === "view";
const isSubmitting = ref(false);
const { createDowntime, updateDowntime } = useDowntime();

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

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  if (viewMode) return;

  try {
    if (editMode && props.id) {
      await updateDowntime(props.id, values);
    } else {
      await createDowntime(values);
    }
    router.push({
      name: "Downtime",

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
      :actionName="editMode ? $t('downtime.editDowntimeInfo') : $t('downtime.createDowntimeInfo')" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("downtime.editDowntimeInfo") : $t("downtime.createDowntimeInfo") }}
          </h2>
          <p class="subheading-title">
            {{ editMode ? $t("downtime.editDowntimeInfoDesc") : $t("downtime.createDowntimeInfoDesc") }}
          </p>
        </div>
      </template>

      <template #content>
        <form form @submit.prevent="onSubmit" class="space-y-6 px-20">
          <div class="grid grid-cols-2 gap-4">
            <div class="w-full">
              <label class="block text-gray-600 text-lg font-bold">{{ $t("downtime.date") }}</label>
              <DatePicker showIcon fluid iconDisplay="input" :placeholder="$t('downtime.datePlaceholder')"/>
            </div>
            <div class="w-full">
              <label class="block mb-1 font-bold text-gray-700">
                {{ $t('downtime.time') }}
             </label>
              <Calendar class="w-full" inputClass="w-full" style="width: 100%" :placeholder="$t('downtime.timePlaceholder')" timeOnly />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('downtime.machine')" v-model="code"
              :placeholder="$t('downtime.MachinePlaceholder')" :error="errors.code" :invalid="!!errors.code"
              :disabled="viewMode" />
            <FormDropdown :label="$t('downtime.WorkOrderOptional')" v-model="name"
              :placeholder="$t('downtime.WorkOrderPlaceholder')" :error="errors.name" :invalid="!!errors.name"
              :disabled="viewMode" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('downtime.DowntimeType')" v-model="department"
              :placeholder="$t('downtime.DowntimeTypePlaceholder')" :error="errors.department"
              :invalid="!!errors.department" :disabled="viewMode" />
            <FormInput :label="$t('downtime.duration')" v-model="name" :placeholder="$t('downtime.durationPlaceholder')"
              :error="errors.name" :invalid="!!errors.name" :disabled="viewMode" />
          </div>

          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("downtime.notes") }}
            </label>
            <Textarea v-model="notes" :placeholder="$t('downtime.notesPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.notes }"
              :disabled="isSubmitting" />
            <small v-if="errors.notes" class="text-danger-500">
              {{ $t(errors.notes) }}
            </small>
          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'downtimes' }"
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