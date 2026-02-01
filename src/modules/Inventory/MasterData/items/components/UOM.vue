<script setup lang="ts">
import { ref } from "vue";
import { useItems } from "../composables/useItems";
const { errors } = useItems();

const data = ref([
    { id: 1, name: "Box", abbreviation: "BX", conversionFactor: 10 },
    { id: 2, name: "Packet", abbreviation: "PK", conversionFactor: 5 },
])

const addNewRule = () => {
    data.value.push({
        id: data.value.length + 1,
        name: "",
        abbreviation: "",
        conversionFactor: 1
    })
}

const deleteRule = (index: number) => {
    data.value.splice(index, 1);
}

</script>
<template>
    <div>
        <p class="mb-5 text-lg">{{ $t("items.uom") }}</p>
        <div class="p-5 border bg-gray-100 border-gray-300 rounded-xl">
            <FormDropdown class="w-full" :label="$t('items.assignedBranch')" :options="[]" :error="errors.branchID"
                optionValue="value" :placeholder="$t('items.assignedBranch')" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-24">
            <div class="md:col-span-1 mt-5">
                <div class="w-full bg-gray-100 rounded-xl flex flex-col items-center gap-3"
                    :class="{ 'base-body': data.length > 0 && $i18n.locale !== 'ar', 'base-body-ar': data.length > 0 && $i18n.locale === 'ar' }">
                    <div class="w-full flex flex-col items-center gap-1 mt-5">
                        <VsxIcon iconName="Ruler" :size="46" color="#5584FF" type="linear" />
                        <p class="text-2xl text-gray-700">1 Kilogram (KG)</p>
                    </div>
                    <div class="bg-primary-300 p-2 w-full rounded-b-xl">
                        <p class="text-center text-sm text-white">Base Unit</p>
                    </div>
                </div>
            </div>
            <div class="md:col-span-3 flex flex-col items-center gap-3 mt-5">
                <div v-for="(item, index) in data" :key="'key-' + index"
                    class="p-5 border bg-gray-100 border-gray-300 rounded-xl w-full"
                    :class="{ 'rule-body-ar': $i18n.locale === 'ar', 'rule-body': $i18n.locale !== 'ar' }">
                    <div class="">
                        <p class="font-bold">Rule {{ index + 1 }}</p>
                        <div class="w-full grid grid-cols-1 md:grid-cols-5 gap-4 mt-3 items-center">
                            <div class="md:col-span-2">
                                <FormDropdown class="w-full" :label="$t('items.assignedBranch')" :options="[]"
                                    v-model="item.name" optionValue="value" :placeholder="$t('items.assignedBranch')" />
                                <div class="flex gap-2 mt-2 items-center text-success-500">
                                    <VsxIcon iconName="InfoCircle" :size="16" type="linear" />
                                    <p class="text-sm">By Default Item Code</p>
                                </div>
                            </div>
                            <div class="md:col-span-2">
                                <FormDropdown class="w-full" :label="$t('items.assignedBranch')" :options="[]"
                                    v-model="item.name" optionValue="value" :placeholder="$t('items.assignedBranch')" />
                                <div class="flex gap-2 mt-2 items-center text-success-500">
                                    <VsxIcon iconName="InfoCircle" :size="16" type="linear" />
                                    <p class="text-sm">By Default Item Code</p>
                                </div>
                            </div>
                            <div class="md:col-span-1 p-5 flex flex-col justify-center items-center gap-3">
                                <a
                                    class="w-full cursor-pointer flex gap-1 justify-center items-center py-1 rounded-xl border border-warning-500 bg-warning-50 hover:bg-warning-100 text-warning-500">
                                    <VsxIcon iconName="Edit2" :size="16" type="linear" />
                                    Edit
                                </a>
                                <a @click="deleteRule(index)"
                                    class="w-full cursor-pointer flex gap-1 justify-center items-center py-1 rounded-xl border border-danger-500 bg-danger-50 hover:bg-danger-100 text-danger-500">
                                    <VsxIcon iconName="Trash" :size="16" type="linear" />
                                    Delete
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div @click="addNewRule"
                    class="p-3 cursor-pointer hover:bg-primary-100 border border-dashed bg-primary-50 border-primary-500 rounded-xl w-full text-primary-500 mt-3 gap-1 flex justify-center items-center">
                    <VsxIcon iconName="AddSquare" :size="24" type="linear" />
                    Add New Conversion
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.rule-body::before {
    content: "";
    position: relative;
    left: -4.65rem;
    top: -3rem;
    padding: 7rem 1.55rem;
    border-left: 5px solid var(--color-primary-400);
    border-bottom: 5px solid var(--color-primary-400);
    border-radius: 0 0 0 15px;
}

.rule-body:first-of-type::before {
    display: none;
}

.base-body {
    position: relative;
}

.base-body::after {
    content: "";
    position: absolute;
    top: 4.5rem;
    left: 100%;
    width: 6rem;
    height: 5px;
    background-color: var(--color-primary-400);
}


.rule-body-ar::before {
    content: "";
    position: relative;
    right: -4.65rem;
    top: -2.6rem;
    padding: 7rem 1.55rem;
    border-right: 5px solid var(--color-primary-400);
    border-bottom: 5px solid var(--color-primary-400);
    border-radius: 0 0 15px 0;
}

.rule-body-ar:first-of-type::before {
    display: none;
}

.base-body-ar {
    position: relative;
}

.base-body-ar::after {
    content: "";
    position: absolute;
    top: 4.5rem;
    right: 100%;
    width: 6rem;
    height: 5px;
    background-color: var(--color-primary-400);
}
</style>