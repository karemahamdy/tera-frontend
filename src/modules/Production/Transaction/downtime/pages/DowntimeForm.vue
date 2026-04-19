<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { downtimeSchema } from "../validation/DowntimeSchema";
import { useDowntime } from "../composables/useDowntime";
import router from "@/app/router";
import { useLookups } from "@/composables/useLookups";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  mode: "edit" | "create" | "view";
  id?: string;
}>();
const { t } = useI18n();

const editMode = props.mode === "edit";
const isSubmitting = ref(false);
const { createDowntime, updateDowntime, fetchDowntimeById } = useDowntime();
const { getMachineLookups, machineLookups } = useLookups();

const downtimeTypeOptions = [
  { label: t("type.Breakdown"), value: "Breakdown" },
  { label: t("type.Setup"), value: "Setup" },
  { label: t("type.MaterialShortage"), value: "MaterialShortage" },
  { label: t("type.QualityIssue"), value: "QualityIssue" },
  { label: t("type.PowerOutage"), value: "PowerOutage" },
  { label: t("type.OperatorAbsence"), value: "OperatorAbsence" },
  { label: t("type.Other"), value: "Other" },
];
const getNowValues = () => {
  const now = new Date();
  return {
    date: now,
    time: now,
  };
};

const now = getNowValues();
type downtimeValues = {
  date: Date | null;
  time: Date | null;
  downtimeType: string | null;
  machineId: string | null;
  workOrderId: string | null;
  notes: string | null;
  duration: number | null;
   rowVersion?: string | null,
};

const initialValues: downtimeValues = {
   date: editMode ? null : now.date,
  time: editMode ? null : now.time,
  downtimeType: null,
  machineId: null,
  workOrderId: null,
  notes: null,
  duration: null,
};

const { errors, defineField, handleSubmit, setValues } = useForm<downtimeValues>({
  validationSchema: downtimeSchema,
  initialValues,
});

const [date] = defineField("date");
const [time] = defineField("time");
const [workOrderId] = defineField("workOrderId");
const [notes] = defineField("notes");
const [machineId] = defineField("machineId");
const [downtimeType] = defineField("downtimeType");
const [duration] = defineField("duration");

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  try {
    const payload = {
      ...values,
      date: values.date
        ? values.date.toISOString().split("T")[0]
        : null,

      time: values.time
        ? values.time.toTimeString().split(" ")[0]
        : null,
    };

    if (editMode && props.id) {
      await updateDowntime(props.id, payload);
    } else {
      await createDowntime(payload);
    }

    router.push({ name: "Downtime" });
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
});
onMounted(async () => {

  if (editMode && props.id) {
    const data = await fetchDowntimeById(props.id);
    if (data) {
      const mappedValues: downtimeValues = {
        date: data.date ? new Date(data.date) : null,
        time: data.time
          ? new Date(`1970-01-01T${data.time}`)
          : null,
        downtimeType: data.downtimeType ?? null,
        machineId: data.machineId ?? null,
        workOrderId: data.workOrderId ?? null,
        duration: data.duration ?? null,
        notes: data.notes ?? null,
         rowVersion: data.rowVersion,

      };
      setValues(mappedValues);
    }
  }
  getMachineLookups()
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
              <DatePicker v-model="date" showIcon fluid iconDisplay="input"
                :placeholder="$t('downtime.datePlaceholder')" />
            </div>
            <div class="w-full">
              <label class="block mb-1 font-bold text-gray-700">
                {{ $t('downtime.time') }}
              </label>
              <Calendar v-model="time" class="w-full" inputClass="w-full" style="width: 100%"
                :placeholder="$t('downtime.timePlaceholder')" timeOnly />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('downtime.machine')" v-model="machineId" :options="machineLookups"
              :placeholder="$t('downtime.MachinePlaceholder')" :error="errors.machineId" :invalid="!!errors.machineId"
              />
            <FormDropdown :label="$t('downtime.WorkOrderOptional')" v-model="workOrderId"
              :placeholder="$t('downtime.WorkOrderPlaceholder')" :error="errors.workOrderId"
              :invalid="!!errors.workOrderId" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('downtime.DowntimeType')" v-model="downtimeType"  :options="downtimeTypeOptions"
              :placeholder="$t('downtime.DowntimeTypePlaceholder')" :error="errors.downtimeType"
              :invalid="!!errors.downtimeType" />
            <FormInput :label="$t('downtime.duration')" v-model="duration"
              :placeholder="$t('downtime.durationPlaceholder')" :error="errors.duration" :invalid="!!errors.duration"
              />
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
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'Downtime' }"
              :disabled="isSubmitting" />
            <BaseButton type="submit"  :label="editMode ? 'button.save' : 'button.create'"
              variant="primary" block :disabled="isSubmitting" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>