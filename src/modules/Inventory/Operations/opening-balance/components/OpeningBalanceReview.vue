<template>
    <p class="font-bold text-xl mb-10">{{ $t("OpeningBalance.reviewOpeningBalance") }}</p>
    <div class="grid grid-cols-3 justify-between">
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.item") }}</p>
            <p>Office Chair - Ergonomic</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.warehouse") }}</p>
            <p>North Warehouse</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.zone") }}</p>
            <p>Zone B</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.Quantity") }}</p>
            <p>12 PCS</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.UnitCost") }}</p>
            <p>20.00</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.TotalValue") }}</p>
            <p>240.00</p>
        </div>
        <div class="mb-5">
            <p class="text-gray-500">{{ $t("OpeningBalance.date") }}</p>
            <p>2025-01-01</p>
        </div>

    </div>
</template>