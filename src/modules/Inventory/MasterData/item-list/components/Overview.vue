<script setup lang="ts">

const itemData = {
    // Item Information
    itemCode: "ITM-001",
    branch: "Cairo Branch",
    itemName1: "Hydraulic Pump Model A",
    warehouse: "Main Warehouse",
    itemName2: "Electrical Equipment",
    itemGroup: "Group 2",
    hsCode: "8501.52.20",
    category: "Motors & Drives",
    description: "Three-phase electric motor",
    itemType: "Raw Material",
    productionCode: "PRD-MTR-05HP",
    manufacturer: "Siemens",
    productionName: "ABC Hydraulics Inc.",
    partNumber: "1LE1001-1AA23",
    accessScope: "Branch-Specific Access",
    barcodeSku: "SKU-MTR-001245",

    // Tracking & Parameters
    serialTracking: "Enabled", // Using string as per design visual (green text)
    reorderPoint: "20 PCS",
    reorderQuantity: "50 PCS",
    leadTime: "14 days",

    // Groups
    itemGroup1: "Raw Materials",
    itemGroup2: "Packaging Materials",
    itemGroup3: "Finished Goods",
    itemGroup4: "Finished Goods",

    // Units of Measure
    baseUom: "BOX",
    uomConversion: "(1 BOX = 12 PCS)",
    purchaseUom: "PCS",
    purchaseUomDetail: "(1 PCS)",

    // Cost Information
    movingAverage: "$450.00",
    lastCost: "$455.00",
    standardCost: "$445.00",
    totalValue: "$10350.00",

    // Attachment
    attachments: [
        { name: "Item / Computer", size: "112KB . PDF", type: "pdf", img: "" },
        { name: "Item / Computer", size: "205KB . img", type: "img", img: "" }
    ],

    // Stats
    totalOnHand: 37,
    availableItems: 18,
    holdItems: 19,
    avgCost: 470
};
</script>
<template>
    <!-- Item Information Section -->
    <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">
        <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.itemInformation') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-24">
            <!-- Left Column -->
            <div class="space-y-5">
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemCode') }}:</span><span class="text-[#101828] text-sm font-medium">{{ itemData.itemCode }}</span>
                </div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemName1') }}:</span><span class="text-[#101828] text-sm font-medium">{{ itemData.itemName1 }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemName2') }}:</span><span class="text-[#101828] text-sm font-medium">{{ itemData.itemName2 }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.hsCode') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ itemData.hsCode }}</span></div>
                <div class="flex justify-between items-center"><span
                        class="text-[#667085] text-sm">{{ $t('itemList.overview.description') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ itemData.description }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.productionCode') }}:</span><span class="text-[#101828] text-sm font-medium">{{ itemData.productionCode
                        }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.productionName') }}:</span><span class="text-[#101828] text-sm font-medium">{{ itemData.productionName
                        }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.accessScope') }}:</span><span class="text-[#101828] text-sm font-medium">{{ itemData.accessScope }}</span>
                </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-5">
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.branch') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ itemData.branch }}</span></div>
                <div class="flex justify-between items-center"><span
                        class="text-[#667085] text-sm">{{ $t('itemList.overview.warehouse') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ itemData.warehouse }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemGroup') }}:</span><span class="text-[#101828] text-sm font-medium">{{ itemData.itemGroup }}</span>
                </div>
                <div class="flex justify-between items-center"><span
                        class="text-[#667085] text-sm">{{ $t('itemList.overview.category') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ itemData.category }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemType') }}:</span><span class="text-[#101828] text-sm font-medium">{{ itemData.itemType }}</span>
                </div>
                <div class="flex justify-between items-center"><span
                        class="text-[#667085] text-sm">{{ $t('itemList.overview.manufacturer') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ itemData.manufacturer }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.partNumber') }}:</span><span class="text-[#101828] text-sm font-medium">{{ itemData.partNumber }}</span>
                </div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.barcodeSku') }}:</span><span class="text-[#101828] text-sm font-medium">{{ itemData.barcodeSku }}</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Middle Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <!-- Tracking & Parameters -->
        <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">
            <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.trackingParameters') }}</h3>
            <div class="space-y-5">
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.serialTracking') }}:</span>
                    <span class="text-[#027A48] text-sm font-medium">{{ itemData.serialTracking }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.reorderPoint') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.reorderPoint }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.reorderQuantity') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.reorderQuantity }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.leadTime') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.leadTime }}</span>
                </div>
            </div>
        </section>

        <!-- Groups -->
        <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">

            <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.groups') }}</h3>
            <div class="space-y-5">
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemGroup1') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.itemGroup1 }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemGroup2') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.itemGroup2 }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemGroup3') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.itemGroup3 }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemGroup4') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.itemGroup4 }}</span>
                </div>
            </div>
        </section>

        <!-- Units of Measure -->
        <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">

            <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.unitsOfMeasure') }}</h3>
            <div class="space-y-3">
                <div class="bg-[#F0F3FA] p-4 rounded-lg flex justify-between items-center border border-gray-100">
                    <span class="font-bold text-[#101828]">{{ itemData.baseUom }}</span>
                    <span class="text-[#667085] text-sm">{{ itemData.uomConversion }}</span>
                </div>
                <div class="bg-[#F0F3FA] p-4 rounded-lg flex justify-between items-center border border-gray-100">
                    <span class="font-bold text-[#101828]">{{ itemData.purchaseUom }}</span>
                    <span class="text-[#667085] text-sm">{{ itemData.purchaseUomDetail }}</span>
                </div>
            </div>
        </section>

        <!-- Cost Information -->
        <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">

            <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.costInformation') }}</h3>
            <div class="space-y-5">
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.movingAverage') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.movingAverage }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.lastCost') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.lastCost }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.standardCost') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.standardCost }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.totalValue') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ itemData.totalValue }}</span>
                </div>
            </div>
        </section>
    </div>

    <!-- Item Attachment -->
    <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">

        <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.itemAttachment') }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div v-for="(att, index) in itemData.attachments" :key="index"
                class="border border-gray-200 rounded-lg p-3 flex gap-4 bg-white hover:bg-gray-50 transition cursor-pointer">
                <!-- Placeholder for preview -->
                <div
                    class="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img v-if="att.type === 'img'" :src="att.img" class="w-full h-full object-cover" />
                    <span v-else class="text-xs font-bold text-gray-500">PDF</span>
                </div>
                <div class="flex flex-col justify-center">
                    <span class="text-sm font-medium text-[#101828]">{{ att.name }}</span>
                    <span class="text-xs text-[#667085]">{{ att.size }}</span>
                </div>
            </div>
        </div>
    </section>
</template>