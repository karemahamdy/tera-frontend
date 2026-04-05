<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { MachinesSchema } from "../validation/MachinesSchema";
import { useMachines } from "../composables/useMachines";
import router from "@/app/router";
import { useLookups } from "@/composables/useLookups";
import type { MachineValues } from "../types/Machines";

const props = defineProps<{
  mode: "edit" | "create" | "view";
  id?: string;
}>();

const editMode = props.mode === "edit";
const viewMode = props.mode === "view";
const isSubmitting = ref(false);
const { createMachines, updateMachines, fetchMachinesById } = useMachines();
const { getWorkCentersLookups, workCentersLookups } = useLookups();

const initialValues: MachineValues = {
  machineCode: "",
  machineName: "",
  machineModel: "",
  workCenterId: "",
  machineCapacity: null,
  costPerHour: null,
  efficiencyPercentage: null,
  overheadPercentage: null,
  setupTime: null,
  setupCostPerHour: null,
  note: null,
  isActive: true,
};

const { errors, defineField, handleSubmit, setValues } = useForm<MachineValues>({
  validationSchema: MachinesSchema,
  initialValues,
});

const [machineCode] = defineField("machineCode");
const [machineName] = defineField("machineName");
const [workCenterId] = defineField("workCenterId");
const [machineCapacity] = defineField("machineCapacity");
const [costPerHour] = defineField("costPerHour");
const [efficiencyPercentage] = defineField("efficiencyPercentage");
const [overheadPercentage] = defineField("overheadPercentage");
const [setupTime] = defineField("setupTime");
const [setupCostPerHour] = defineField("setupCostPerHour");
const [note] = defineField("note");
const [isActive] = defineField("isActive");

onMounted(async () => {
  await getWorkCentersLookups();
  if (editMode && props.id || viewMode && props.id) {
    const data = await fetchMachinesById(props.id);
    if (data) {
      const mappedValues: MachineValues = {
        machineCode: data.machineCode ?? null,
        machineName: data.machineName ?? null,
        machineModel: data.machineModel ?? null,
        workCenterId: data.workCenterId ?? null,
        machineCapacity: data.machineCapacity ?? null,
        costPerHour: data.costPerHour ?? null,
        efficiencyPercentage: data.efficiencyPercentage ?? null,
        overheadPercentage: data.overheadPercentage ?? null,
        setupTime: data.setupTime ?? null,
        setupCostPerHour: data.setupCostPerHour ?? null,
        isActive: data.isActive ?? null,
        note: data.note ?? null,
         rowVersion: data.rowVersion,

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
      await updateMachines(props.id, values);
    } else {
      await createMachines(values);
    }
    router.push({
      name: "Machines",

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
      :actionName="editMode ? $t('machines.editMachineInfo') : $t('machines.createMachineInfo')" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("machines.editMachineInfo") : $t("machines.createMachineInfo") }}
          </h2>
          <p class="subheading-title">
            {{ editMode ? $t("machines.editMachineInfoDesc") : $t("machines.createMachineInfoDesc") }}
          </p>
        </div>
      </template>

      <template #content>
        <form form @submit.prevent="onSubmit" class="space-y-6 px-20">

          <div class="grid grid-cols-2 gap-4">
            <FormInput :label="$t('machines.MachineCode')" v-model="machineCode"
              :placeholder="$t('machines.MachineCodePlaceholder')" :error="errors.machineCode"
              :invalid="!!errors.machineCode" :disabled="viewMode" />
            <FormInput :label="$t('machines.MachineName')" v-model="machineName"
              :placeholder="$t('machines.MachineNamePlaceholder')" :error="errors.machineName"
              :invalid="!!errors.machineName" :disabled="viewMode" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown :label="$t('machines.workCenter')" v-model="workCenterId" :options="workCentersLookups"
              :placeholder="$t('machines.workCenterPlaceholder')" :error="errors.workCenterId"
              :invalid="!!errors.workCenterId" :disabled="viewMode" />
            <FormInput :label="$t('machines.Capacity')" v-model.number="machineCapacity"
              :placeholder="$t('machines.capacityPlaceholder')" :error="errors.machineCapacity"
              :invalid="!!errors.machineCapacity" :disabled="viewMode" />

          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormInput :label="$t('machines.CostPerHour')" v-model.number="costPerHour"
              :placeholder="$t('machines.CostPerHourPlaceholder')" :error="errors.costPerHour"
              :invalid="!!errors.costPerHour" :disabled="viewMode" />
            <FormInput :label="$t('machines.SetupTime')" v-model.number="setupTime"
              :placeholder="$t('machines.SetupTimePlaceholder')" :error="errors.setupTime" :invalid="!!errors.setupTime"
              :disabled="viewMode" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormInput :label="$t('machines.SetupCostPerHour')" v-model.number="setupCostPerHour"
              :placeholder="$t('machines.SetupCostPerHourPlaceholder')" :error="errors.setupCostPerHour"
              :invalid="!!errors.setupCostPerHour" :disabled="viewMode" />
            <FormInput :label="$t('machines.Efficiency')" v-model.number="efficiencyPercentage"
              :placeholder="$t('machines.EfficiencyPlaceholder')" :error="errors.efficiencyPercentage"
              :invalid="!!errors.efficiencyPercentage" :disabled="viewMode" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <FormInput :label="$t('machines.Overhead')" v-model.number="overheadPercentage"
              :placeholder="$t('machines.OverheadPlaceholder')" :error="errors.overheadPercentage"
              :invalid="!!errors.overheadPercentage" :disabled="viewMode" />
            <ToggleItem :title="$t('status')" :label="$t('button.active')" v-model="isActive" />
          </div>

          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("machines.notes") }}
            </label>
            <Textarea v-model="note" :placeholder="$t('machines.notesPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.note }"
              :disabled="isSubmitting" />
            <small v-if="errors.note" class="text-danger-500">
              {{ $t(errors.note) }}
            </small>
          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'Machines' }"
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