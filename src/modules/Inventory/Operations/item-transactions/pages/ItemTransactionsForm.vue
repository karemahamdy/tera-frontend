<script setup lang="ts">
import { useLookups } from "@/composables/useLookups";
import { ref, onMounted } from "vue";
const {
    warehouseLookup,
    getWarehouseLookups
} = useLookups();

const transactionType = ref<string>("merge")
const warehouseID = ref<string>("")
const notes = ref<string>("")
const transactionTypes = ref([
    { label: "Merge", value: "merge" },
    { label: "Transfer", value: "transfer" },
]);

onMounted(() => {
    Promise.all([
        (getWarehouseLookups()),
    ]);
});

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="operation.title" actionName="operation.itemTransactions" />
        <card class="bg-white rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="itemTransaction.createNewTransaction"
                    subtitle="itemTransaction.newTransactionDescription" :showSearch="false" />
            </template>
            <template #content>
                <div :class="{
                    'grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2': transactionType == 'transfer'
                }">
                    <FormDropdown class="w-full" :label="$t('itemTransaction.transactionType')"
                        :options="transactionTypes" v-model="transactionType" optionValue="value"
                        :placeholder="$t('itemTransaction.selectTransactionType')" />

                    <FormDropdown v-if="transactionType == 'transfer'" class="w-full" :label="$t('items.warehouse')"
                        :options="warehouseLookup" v-model="warehouseID" optionValue="value"
                        :placeholder="$t('items.warehousePlaceholder')" />
                </div>

                <div class="mt-5">
                    <p><strong>{{ $t("itemTransaction.sourceTargetItems") }}</strong></p>
                    <div class="grid grid-cols-9 justify-center items-center gap-2">
                        <div class="col-span-4 bg-primary-50 rounded-xl p-5">
                            <p class="text-primary-500"><strong>{{ $t("itemTransaction.sourceItemFrom") }}</strong>
                            </p>
                            <FormDropdown class="w-full mt-3" :label="$t('itemTransaction.sourceItem')" :options="[]"
                                v-model="transactionType" optionValue="value"
                                :placeholder="$t('itemTransaction.sourceItemSelect')" />
                            <div v-if="transactionType === 'transfer'" class="mt-3 p-5 bg-primary-25 rounded-xl">
                                <p class="text-lg"><strong>{{ $t("itemTransaction.sourceItemDetails") }}</strong></p>
                                <div class="text-sm">
                                    <p>{{ $t("itemTransaction.totalQuantity") }}0</p>
                                    <p>{{ $t("itemTransaction.locations") }}0</p>
                                    <p>{{ $t("itemTransaction.transactions") }}0</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-1 flex justify-center items-center h-full">
                            <div class="p-3 rounded-full bg-primary-500 text-white">
                                <VsxIcon v-if="transactionType === 'transfer'" iconName="ArrowSwapHorizontal"
                                    type="linear" />
                                <VsxIcon v-else iconName="Routing2" type="linear" />
                            </div>
                        </div>
                        <div class="col-span-4 bg-primary-50 rounded-xl p-5">
                            <p class="text-primary-500"><strong>{{ $t("itemTransaction.targetItemTo") }}</strong>
                            </p>
                            <FormDropdown class="w-full mt-3" :label="$t('itemTransaction.targetItem')" :options="[]"
                                v-model="transactionType" optionValue="value"
                                :placeholder="$t('itemTransaction.targetItemSelect')" />
                            <div v-if="transactionType === 'transfer'" class="mt-3 p-5 bg-primary-25 rounded-xl">
                                <p class="text-lg"><strong>{{ $t("itemTransaction.targetItemDetails") }}</strong></p>
                                <div class="text-sm">
                                    <p>{{ $t("itemTransaction.totalQuantity") }}0</p>
                                    <p>{{ $t("itemTransaction.locations") }}0</p>
                                    <p>{{ $t("itemTransaction.transactions") }}0</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div>
                    <label class="block mt-5 font-medium">
                        {{ $t("itemTransaction.notes") }}
                    </label>
                    <Textarea :modelValue="notes" rows="2" class="w-full p-3 border rounded-lg"
                        :placeholder="$t('itemTransaction.notesPlaceholder')" :disabled="disabled" />
                </div>

                <div v-if="transactionType === 'merge'"
                    class="mt-5 border border-warning-500 bg-warning-50 rounded-xl p-5">
                    <p class="text-warning-500 flex items-center gap-2">
                        <VsxIcon iconName="InfoCircle" type="linear" />
                        <strong>{{ $t("itemTransaction.irreversibleOperation") }}</strong>
                    </p>
                    <div class="mt-3 text-sm px-5">
                        <p>{{ $t("itemTransaction.irreversibleOperation1") }}</p>
                        <p>{{ $t("itemTransaction.irreversibleOperation2") }}</p>
                    </div>
                </div>

            </template>
        </card>

    </div>
</template>