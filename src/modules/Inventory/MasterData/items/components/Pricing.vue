<script setup lang="ts">
import { useItems } from "../composables/useItems";
const { errors, accessScope } = useItems();
</script>
<template>
  <div>
    <div>
      <p class="font-bold mb-5 text-lg">{{ $t("items.pricingInformation") }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormDropdown
          class="w-full"
          :label="$t('items.assignedBranch')"
          :options="[]"
          :error="errors.branchID"
          optionValue="value"
          :placeholder="$t('items.assignedBranch')"
        />
        <FormDropdown
          class="w-full"
          :label="$t('items.assignedBranch')"
          :options="[]"
          :error="errors.branchID"
          optionValue="value"
          :placeholder="$t('items.assignedBranch')"
        />
        <div class="w-full md:col-span-2">
          <p class="font-bold mb-5">{{ $t("items.accessScope") }}</p>
          <div class="w-full flex flex-wrap gap-1 justify-between items-center">
            <div
              class="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-300"
            >
              <Checkbox v-model="accessScope" inputId="inputId" binary @click.stop />
              <label class="font-medium cursor-pointer" for="inputId">
                {{ $t("roles.globalAccess") }}
              </label>
            </div>
          </div>
        </div>
        <FormInput
          :label="$t('items.code')"
          :error="errors.code"
          :placeholder="$t('items.codePlaceholder')"
          :invalid="!!errors.code"
        />
        <FormInput
          :label="$t('items.code')"
          :error="errors.code"
          :placeholder="$t('items.codePlaceholder')"
          :invalid="!!errors.code"
        />
        <FormInput
          :label="$t('items.code')"
          :error="errors.code"
          :placeholder="$t('items.codePlaceholder')"
          :invalid="!!errors.code"
        />
        <FormInput
          :label="$t('items.code')"
          :error="errors.code"
          :placeholder="$t('items.codePlaceholder')"
          :invalid="!!errors.code"
        />
      </div>
    </div>
  </div>
</template>
