<script setup lang="ts">
import { ref } from "vue";

const notes = ref<string>("")
const date = ref<string>("")

</script>

<template>
    <div>
        <div>
            <PageHeader title="Start New Physical Count" subtitle="Compare system stock with actual physical count"
                :showSearch="false" />
            <div>

                <div class="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2">
                    <FormInput :label="$t('Count Number')" v-model="date" class="mt-5" :placeholder="$t('EX: C-001')" />
                    <FormInput :label="$t('Scheduled Date')" v-model="date" type="date" class="mt-5" :placeholder="$t('Scheduled Date')" />
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