<script setup lang="ts">
import { onMounted } from "vue";
import { useItems } from "../composables/useItems";
import { useLookups } from "@/composables/useLookups";

const {
  errors,
  code,
  name,
  nameAr,
  codeHS,
  description,
  accessScope,
  branchID,
  productionCode,
  productionName,
  warehouseID,
  categoryID,
  itemGroup1ID,
  itemGroup2ID,
  itemGroup3ID,
  itemGroup4ID,
  itemTypeID,
  manufacturerID,
  manufacturerPartNumber,
  barcodeSKU,
} = useItems();

const {
  warehouseLookups,
  userAssignedBranchesLookups,
  categoryLookups,
  group2Lookups,
  group3Lookups,
  group4Lookups,
  group1Lookups,
  itemTypeLookups,
  businessPartnerLookups,
  getItemCategoryLookups,
  getWarehouseLookups,
  getUserAssignedBranchesLookups,
  getItemGroup1Lookups,
  getItemGroup2Lookups,
  getItemGroup3Lookups,
  getItemGroup4Lookups,
  getBusinessPartnerLookups,
  getItemTypeLookups,
} = useLookups();

onMounted(() => {
  Promise.all([
    (getWarehouseLookups(),
    getUserAssignedBranchesLookups(),
    getItemCategoryLookups(),
    getItemGroup1Lookups(),
    getItemGroup2Lookups(),
    getItemGroup3Lookups(),
    getItemGroup4Lookups(),
    getItemTypeLookups(),
    getBusinessPartnerLookups()),
  ]);
});
</script>
<template>
  <div>
    <div>
      <p class="font-bold mb-5 text-lg">{{ $t("items.basicInformation") }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          :label="$t('items.code')"
          :error="errors.code"
          v-model="code"
          :placeholder="$t('items.codePlaceholder')"
          :invalid="!!errors.code"
        />
        <FormInput
          :label="$t('items.name')"
          :error="errors.name"
          v-model="name"
          :placeholder="$t('items.namePlaceholder')"
          :invalid="!!errors.name"
        />
        <FormInput
          :label="$t('items.nameAr')"
          :error="errors.nameAr"
          v-model="nameAr"
          :placeholder="$t('items.nameArPlaceholder')"
          :invalid="!!errors.nameAr"
        />
        <FormInput
          :label="$t('items.codeHS')"
          :error="errors.codeHS"
          v-model="codeHS"
          :placeholder="$t('items.codeHSPlaceholder')"
          :invalid="!!errors.codeHS"
        />
        <div class="w-full md:col-span-2">
          <label class="text-gray-700 font-medium mb-2 block">
            {{ $t("userGroup.description") }}
          </label>

          <Textarea
            :placeholder="$t('items.descriptionPlaceholder')"
            class="mt-1 w-full p-3 border rounded-lg"
            rows="2"
            v-model="description"
            :class="{ 'border-danger-500': errors.description }"
          />
          <small v-if="errors.description" class="text-danger-500">
            {{ $t(errors.description) }}
          </small>
        </div>
        <div class="w-full md:col-span-2">
          <p class="font-bold mb-5">{{ $t("items.accessScope") }}</p>
          <div class="w-full flex flex-wrap gap-1 justify-between items-center">
            <div
              class="w-[49%] flex items-center gap-3 p-3 rounded-xl border border-gray-300"
            >
              <RadioButton
                inputId="global"
                name="access"
                value="global"
                v-model="accessScope"
              />
              <label class="font-medium cursor-pointer" for="global">
                {{ $t("roles.globalAccess") }}
              </label>
            </div>
            <div
              class="w-[49%] flex items-center gap-3 p-3 rounded-xl border border-gray-300"
            >
              <RadioButton
                inputId="branch"
                name="access"
                value="branch"
                v-model="accessScope"
              />
              <label class="font-medium cursor-pointer" for="branch">
                {{ $t("roles.branchSpecific") }}
              </label>
            </div>
          </div>
        </div>
        <FormDropdown
          class="w-full md:col-span-2"
          :label="$t('items.assignedBranch')"
          :options="userAssignedBranchesLookups"
          :error="errors.branchID"
          v-model="branchID"
          optionValue="value"
          :placeholder="$t('items.branchPlaceholder')"
        />
        <FormInput
          :label="$t('items.productionCode')"
          :error="errors.productionCode"
          v-model="productionCode"
          :placeholder="$t('items.productionCodePlaceholder')"
          :invalid="!!errors.productionCode"
        />
        <FormInput
          :label="$t('items.productionName')"
          :error="errors.productionName"
          v-model="productionName"
          :placeholder="$t('items.productionNamePlaceholder')"
          :invalid="!!errors.productionName"
        />
      </div>
    </div>
    <div>
      <p class="font-bold mb-5 mt-10 text-lg">
        {{ $t("items.warehouseClassification") }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormDropdown
          class="w-full"
          :label="$t('items.warehouse')"
          :options="warehouseLookups"
          v-model="warehouseID"
          :error="errors.warehouseID"
          optionValue="value"
          :placeholder="$t('items.warehousePlaceholder')"
        />
        <FormDropdown
          class="w-full"
          :label="$t('items.category')"
          :options="categoryLookups"
          v-model="categoryID"
          :error="errors.categoryID"
          optionValue="value"
          :placeholder="$t('items.categoryPlaceholder')"
        />
        <FormDropdown
          class="w-full"
          :label="$t('items.itemGroup1')"
          :options="group1Lookups"
          v-model="itemGroup1ID"
          :error="errors.itemGroup1ID"
          optionValue="value"
          :placeholder="$t('items.itemGroup1Placeholder')"
        />
        <FormDropdown
          class="w-full"
          :label="$t('items.itemGroup2')"
          :options="group2Lookups"
          v-model="itemGroup2ID"
          :error="errors.itemGroup2ID"
          optionValue="value"
          :placeholder="$t('items.itemGroup2Placeholder')"
        />
        <FormDropdown
          class="w-full"
          :label="$t('items.itemGroup3')"
          :options="group3Lookups"
          v-model="itemGroup3ID"
          :error="errors.itemGroup3ID"
          optionValue="value"
          :placeholder="$t('items.itemGroup3Placeholder')"
        />
        <FormDropdown
          class="w-full"
          :label="$t('items.itemGroup4')"
          :options="group4Lookups"
          v-model="itemGroup4ID"
          :error="errors.itemGroup4ID"
          optionValue="value"
          :placeholder="$t('items.itemGroup4Placeholder')"
        />
      </div>
    </div>
    <div>
      <p class="font-bold mb-5 mt-10 text-lg">
        {{ $t("items.itemDetails") }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormDropdown
          class="w-full"
          :label="$t('items.itemType')"
          :options="itemTypeLookups"
          v-model="itemTypeID"
          :error="errors.itemTypeID"
          optionValue="value"
          :placeholder="$t('items.itemTypePlaceholder')"
        />
        <FormDropdown
          class="w-full"
          :label="$t('items.manufacturer')"
          :options="businessPartnerLookups"
          v-model="manufacturerID"
          :error="errors.manufacturerID"
          optionValue="value"
          :placeholder="$t('items.manufacturerPlaceholder')"
        />
        <FormInput
          :label="$t('items.manufacturerPartNumber')"
          v-model="manufacturerPartNumber"
          :error="errors.manufacturerPartNumber"
          :placeholder="$t('items.manufacturerPartNumberPlaceholder')"
          :invalid="!!errors.manufacturerPartNumber"
        />
        <FormInput
          :label="$t('items.barcodeSKU')"
          v-model="barcodeSKU"
          :error="errors.barcodeSKU"
          :placeholder="$t('items.barcodeSKUPlaceholder')"
          :invalid="!!errors.barcodeSKU"
        />
      </div>
    </div>
  </div>
</template>
