<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import FormDropdown from "@/sharedComponents/inputs/FormDropdown.vue";
import { LDCSchema } from "../validation/LDCSchema";

const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const isSubmitting = ref(false);

const accountFields = [
  { key: "localPurchaseAccount", label: "LDC.localPurchaseAccount" },
  { key: "localSalesAccount", label: "LDC.localSalesAccount" },
  { key: "localPurchaseReturn", label: "LDC.localPurchaseReturn" },
  { key: "localSalesReturn", label: "LDC.localSalesReturn" },
  { key: "importPurchaseAccount", label: "LDC.importPurchaseAccount" },
  { key: "importPurchaseReturn", label: "LDC.importPurchaseReturn" },
  { key: "exportSalesAccount", label: "LDC.exportSalesAccount" },
  { key: "exportSalesReturn", label: "LDC.exportSalesReturn" },
  { key: "physicalCount", label: "LDC.physicalCount" },
  { key: "cogs", label: "LDC.cogs" },
];

const { errors, defineField } = useForm({
  validationSchema: LDCSchema,
  initialValues: {
    code: "",
    LDCNameAr: "",
    LDCNameEn: "",
    inventoryAdjustment: "",
    ...Object.fromEntries(accountFields.map(f => [f.key, null]))
  }
});

const [code] = defineField("code");
const [LDCNameAr] = defineField("LDCNameAr");
const [LDCNameEn] = defineField("LDCNameEn");
const [inventoryAdjustment] = defineField("inventoryAdjustment");

const fields = Object.fromEntries(
  accountFields.map((f: any) => [f.key, defineField(f.key)[0]])
) as Record<string, any>;

const accountsOptions = ref([
  { label: "Account 1", value: 1 },
  { label: "Account 2", value: 2 }
]);
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
        <form @submit.prevent="" class="space-y-6 px-20">
         <FormInput :label="$t('LDC.code')" v-model="code" :placeholder="$t('LDC.codePlaceholder')"
            :error="errors.code" :invalid="!!errors.code" />

          <div class="grid grid-cols-2 gap-4">        
            <FormInput :label="$t('LDC.nameEn')" v-model="LDCNameEn" :placeholder="$t('LDC.nameEnPlaceholder')"
            :error="errors.LDCNameEn" :invalid="!!errors.LDCNameEn" :disabled="editMode" />
            <FormInput :label="$t('LDC.nameAr')" v-model="LDCNameAr" :placeholder="$t('LDC.nameArPlaceholder')"
              :error="errors.LDCNameAr" :invalid="!!errors.LDCNameAr" :disabled="editMode" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FormDropdown v-for="field in accountFields" :key="field.key" :label="$t(field.label)"
              v-model="fields[field.key]" :options="accountsOptions" :placeholder="$t('LDC.select') + ' ' + $t(field.label)"
               />
          </div>

          <FormDropdown :label="$t('LDC.inventoryAdjustment')"
            v-model="inventoryAdjustment" :options="accountsOptions" :placeholder="$t('LDC.select') + ' ' + $t('LDC.inventoryAdjustment')"
            :error="errors.inventoryAdjustment" />

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'LDCs' }"
              :disabled="isSubmitting" />

            <BaseButton type="submit" :label="editMode ? 'button.save' : 'button.create'" variant="primary"
              block :disabled="isSubmitting" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>