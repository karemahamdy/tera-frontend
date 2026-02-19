<script setup lang="ts">
import { ref } from "vue";

const notes = ref<string>("")
const date = ref<string>("")

</script>

<template>
    <div>
        <div>
            <PageHeader title="PhysicalCount.StartNewPhysicalCount" subtitle="PhysicalCount.CompareSystemStockWithActualPhysicalCount"
                :showSearch="false" />
            <div>

                <div class="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2">
                    <FormInput :label="$t('PhysicalCount.CountNumber')" v-model="date" class="mt-5" :placeholder="$t('EX: C-001')" />
                    <FormInput :label="$t('PhysicalCount.ScheduledDate')" v-model="date" type="date" class="mt-5" :placeholder="$t('PhysicalCount.ScheduledDate')" />
                </div>

                <div class="mt-5">
                    <label class="block font-medium">
                        {{ $t("itemTransaction.notes") }}
                    </label>
                    <Textarea :modelValue="notes" rows="2" class="w-full p-3 border rounded-lg"
                        :placeholder="$t('itemTransaction.notesPlaceholder')" />
                </div>

            </div>
        </div>
    </div>
</template>