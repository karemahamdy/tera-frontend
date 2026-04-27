<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { useworkOrder } from "@/modules/Production/Transaction/work-order/composables/useWorkOrder";
import { headerSchema } from "../validation/BOMSchema";
import { useRoute, useRouter } from "vue-router";
import { useLookups } from "@/composables/useLookups";

const isSubmitting = ref(false);
const router = useRouter();
const route = useRoute();
const props = defineProps<{
  mode: "edit" | "create";
  id?: string;
}>();
const editMode = props.mode === "edit";

const { createworkOrder, updateworkOrder } = useworkOrder();
const { getAllItemsLookUp, itemsLookups } = useLookups();
const isCreate = computed(() => route.name === 'BOMCreate')
 
type headerValues = {
  bomCode: string;
  bomName: string;
  parentItemId: string;
  baseQuantity: number;
  notes: string | null;
  isActive: boolean;
  version: string;
};

const initialValues: headerValues = {
  bomCode: "",
  bomName: "",
  parentItemId: "",
  baseQuantity: 1,
  notes: null,
  isActive: true,
  version: "Version 1",
};

const { errors, defineField, handleSubmit, validate } = useForm<headerValues>({
  validationSchema: headerSchema,
  initialValues,
});

const [bomCode] = defineField("bomCode");
const [bomName] = defineField("bomName");
const [parentItemId] = defineField("parentItemId");
const [baseQuantity] = defineField("baseQuantity");
const [notes] = defineField("notes");
const [isActive] = defineField("isActive");
const [version] = defineField("version");
const selectedItem = ref<any>(null);

onMounted(async () => {
    await Promise.all([
        getAllItemsLookUp(),
    ]);
    if (parentItemId.value) {
        onItemSelect(parentItemId.value);
    }
});

const onItemSelect = (itemId: string) => {
    const item = itemsLookups.value.find((i: any) => i.value === itemId);
    if (item?.raw) {
        selectedItem.value = item.raw;
    }
};

// Expose a method the parent can call to get values
const getValues = () => ({
  bomCode: bomCode.value,
  bomName: bomName.value,
  parentItemId: parentItemId.value,
  baseQuantity: baseQuantity.value,
  notes: notes.value,
  isActive: isActive.value,
  version: version.value,
});

const setValues = (data: any) => {
  bomCode.value = data.bomCode;
  bomName.value = data.bomName;
  parentItemId.value = data.parentItemId;
  baseQuantity.value = data.baseQuantity;
  notes.value = data.notes;
  isActive.value = data.isActive ?? true;
  version.value = `Version ${data.version ?? 1}`;
  
  if (data.parentItemId && itemsLookups.value.length) {
     onItemSelect(data.parentItemId);
  } else if (data.parentItemBaseUnit || data.uomName) {
     selectedItem.value = { baseUnitName: data.parentItemBaseUnit || data.uomName };
  }
};

defineExpose({ getValues, validate, setValues });

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
        <!-- Final Product dropdown -->
        <FormDropdown :label="$t('BOM.FinalProduct')" v-model="parentItemId"
          :placeholder="$t('BOM.FinalProductPlaceholder')" :options="itemsLookups" optionLabel="label"
          optionValue="value" @update:modelValue="onItemSelect"
          :error="errors.parentItemId" :invalid="!!errors.parentItemId" />

        <!-- Base UOM - disabled, auto-filled from selected item -->
        <FormInput :label="$t('BOM.BaseUOM')" :modelValue="selectedItem?.baseUnitName ?? ''"
          :placeholder="$t('workOrder.UOMPlaceholder')" disabled />
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