<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import { useForm } from "vee-validate";
import { LDCSchema } from "../validation/LDCSchema";
import { useLookups } from "@/composables/useLookups";
import { useLDC } from "../composables/useLDC";
import router from "@/app/router";

const props = defineProps<{
  mode: "edit" | "create" | "view";
  id?: string;
}>();

const editMode = props.mode === "edit";
const viewMode = props.mode === "view";
const isSubmitting = ref(false);
const { accountLookups, getAccountsLookups } = useLookups();

const { createLDC, updateLDC } = useLDC();
onMounted(async () => {
  await getAccountsLookups();
});

interface AccountField {
  key: string;
  label: string;
}
const accountFields: AccountField[] = [
  { key: "purchaseAccountId", label: "LDC.localPurchaseAccount" },
  { key: "localSalesAccountId", label: "LDC.localSalesAccount" },
  { key: "localPurchaseReturnId", label: "LDC.localPurchaseReturn" },
  { key: "localSalesReturnAccountId", label: "LDC.localSalesReturn" },
  { key: "importPurchaseAccountId", label: "LDC.importPurchaseAccount" },
  { key: "importPurchaseReturnsAccountId", label: "LDC.importPurchaseReturn" },
  { key: "exportSalesAccountId", label: "LDC.exportSalesAccount" },
  { key: "exportSalesReturnAccountId", label: "LDC.exportSalesReturn" },
  { key: "physicalCountAdjustmentId", label: "LDC.physicalCount" },
  { key: "cogsAccountId", label: "LDC.cogs" },
];

type LDCFormValues = {
  code: string;
  nameAr: string;
  nameEn: string;
  inventoryAdjustment: string | null;
} & Record<string, string | null>;

const initialValues: LDCFormValues = {
  code: "",
  nameAr: "",
  nameEn: "",
  inventoryAdjustment: null,
  ...Object.fromEntries(accountFields.map(f => [f.key, null])),
};

const { errors, defineField, handleSubmit } = useForm<LDCFormValues>({
  validationSchema: LDCSchema,
  initialValues,
});

const [code] = defineField("code");
const [nameAr] = defineField("nameAr");
const [nameEn] = defineField("nameEn");
const [inventoryAdjustment] = defineField("inventoryAdjustment");

const fields = Object.fromEntries(
  accountFields.map(f => [f.key, defineField(f.key)[0]])
) as Record<string, Ref<string | null>>;

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
 if (viewMode) return;

  try {
    if (editMode && props.id) {
      await updateLDC(props.id, values);
    } else {
    await createLDC(values);
    router.push({ name: "LDC" });
  } 
}
catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="masterData" actionName="LDC.title" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("LDC.editLDCInfo") : $t("LDC.addLDCInfo") }}
          </h2>
          <p class="subheading-title">
          {{ editMode ? $t("LDC.editLDCInfoDesc") : $t("LDC.addLDCInfoDesc") }}
          </p>
        </div>
      </template>

      <template #content>
        <form form @submit.prevent="onSubmit" class="space-y-6 px-20">
         <FormInput :label="$t('LDC.code')" v-model="code" :placeholder="$t('LDC.codePlaceholder')"
            :error="errors.code" :invalid="!!errors.code" :disabled="viewMode || editMode"/>
          <div class="grid grid-cols-2 gap-4">        
            <FormInput :label="$t('LDC.nameEn')" v-model="nameEn" :placeholder="$t('LDC.nameEnPlaceholder')"
            :error="errors.nameEn" :invalid="!!errors.nameEn" :disabled="viewMode" />
            <FormInput :label="$t('LDC.nameAr')" v-model="nameAr" :placeholder="$t('LDC.nameArPlaceholder')"
              :error="errors.nameAr" :invalid="!!errors.nameAr" :disabled="viewMode" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown v-for="field in accountFields" :key="field.key" :label="$t(field.label)" :disabled="viewMode"
              v-model="fields[field.key]" :options="accountLookups" :placeholder="$t('LDC.select') + ' ' + $t(field.label)"
               />
          </div>

          <FormDropdown :label="$t('LDC.inventoryAdjustment')"
            v-model="inventoryAdjustment" :options="accountLookups" :placeholder="$t('LDC.select') + ' ' + $t('LDC.inventoryAdjustment')"
            :error="errors.inventoryAdjustment" :disabled="viewMode"/>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'LDC' }"
              :disabled="isSubmitting" />

            <BaseButton type="submit" v-if="!viewMode" :label="editMode ? 'button.save' : 'button.create'" variant="primary"
              block :disabled="isSubmitting" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>