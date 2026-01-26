<script setup lang="ts">
const props = defineProps<{
  errors: Record<string, string>;
}>();
import { useItems } from "../composables/useItems";

const { errors, accessScope } = useItems();
</script>

<template>
  <div>
    <p class="font-bold mb-5">{{ $t("items.basicInformation") }}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div class="w-full md:col-span-2">
        <label class="text-gray-700 font-medium mb-2 block">
          {{ $t("userGroup.description") }}
        </label>

        <Textarea
          :placeholder="$t('items.descriptionPlaceholder')"
          class="mt-1 w-full p-3 border rounded-lg"
          rows="2"
          :class="{ 'border-danger-500': errors.description }"
        />
        <small v-if="errors.description" class="text-danger-500">
          {{ $t(errors.description) }}
        </small>
      </div>
      <div class="w-full md:col-span-2">
        <p class="font-bold mb-5">{{ $t("items.accessScope") }}</p>
        <div class="w-full flex flex-wrap gap-1 justify-between items-center">
          <div class="w-[49%] flex items-center gap-3 p-3 rounded-xl border border-gray-300">
            <RadioButton inputId="global" name="access" value="global" v-model="accessScope" />
            <label class="font-medium cursor-pointer" for="global">
              {{ $t("roles.globalAccess") }}
            </label>
          </div>
          <div class="w-[49%] flex items-center gap-3 p-3 rounded-xl border border-gray-300">
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
    </div>
  </div>
</template>
