<script setup lang="ts">
import { usePhysicalCountForm } from "../composables/usePhysicalCountForm";
const { errors, code, countDate, notes } = usePhysicalCountForm();
</script>

<template>
  <div>
    <div>
      <PageHeader
        title="PhysicalCount.StartNewPhysicalCount"
        subtitle="PhysicalCount.CompareSystemStockWithActualPhysicalCount"
        :showSearch="false"
      />
      <div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2"
        >
          <FormInput
            :label="$t('PhysicalCount.CountNumber')"
            v-model="code"
            class="mt-5"
            :error="errors.code"
            :invalid="!!errors.code"
            :placeholder="$t('EX: C-001')"
          />
          <FormInput
            :label="$t('PhysicalCount.ScheduledDate')"
            v-model="countDate"
            type="date"
            class="mt-5"
            :error="errors.countDate"
            :invalid="!!errors.countDate"
            :placeholder="$t('PhysicalCount.ScheduledDate')"
          />
        </div>

        <div class="mt-5">
          <label class="block font-medium">
            {{ $t("itemTransaction.notes") }}
          </label>
          <Textarea
            :v-model="notes"
            rows="2"
            class="w-full p-3 border rounded-lg"
            :placeholder="$t('itemTransaction.notesPlaceholder')"
          />
          <small v-if="errors.notes" class="text-danger-500">
            {{ $t(errors.notes) }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>
