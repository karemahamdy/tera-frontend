<script setup lang="ts">
import { useOpeningBalance } from "../composables/useOpeningBalance";
import {
  formatDateTimeLang,
} from "@/app/utils/dates";
const {
    warehouseName,
    locationName,
    date,
    unitCost,
    quantity,
    itemName,
} = useOpeningBalance();
</script>

<template>
    <p class="font-bold text-xl mb-10">{{ $t("OpeningBalance.reviewOpeningBalance") }}</p>
    <div class="grid grid-cols-3 justify-between">
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.item") }}</p>
            <p>{{ itemName ?? '-' }}</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.warehouse") }}</p>
            <p>{{ warehouseName ?? '-' }}</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.zone") }}</p>
            <p>{{ locationName ?? '-' }}</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.Quantity") }}</p>
            <p>{{ quantity ?? 0 }} {{ $t("itemList.pricingTab.pcs") }}</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.UnitCost") }}</p>
            <p>{{ unitCost ?? 0 }}</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.TotalValue") }}</p>
            <p>{{ (quantity ?? 0) * (unitCost ?? 0) }}</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.date") }}</p>
            <p>{{ formatDateTimeLang(date) }}</p>
        </div>

    </div>
</template>