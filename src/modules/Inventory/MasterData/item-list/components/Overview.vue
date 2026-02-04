<script setup lang="ts">
import type { ItemOverview } from '../types/itemList';

defineProps<{
    data: ItemOverview
}>();

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const downloadFile = (url: string) => {
    window.open(url, '_blank');
};

</script>
<template>
    <!-- Item Information Section -->
    <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">
        <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.itemInformation') }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-24">
            <!-- Left Column -->
            <div class="space-y-5">
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemCode') }}:</span><span class="text-[#101828] text-sm font-medium">{{ data.itemInformation.code }}</span>
                </div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemName1') }}:</span><span class="text-[#101828] text-sm font-medium">{{ data.itemInformation.nameEn }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemName2') }}:</span><span class="text-[#101828] text-sm font-medium">{{ data.itemInformation.nameAr }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.hsCode') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ data.itemInformation.hsCode }}</span></div>
                <div class="flex justify-between items-center"><span
                        class="text-[#667085] text-sm">{{ $t('itemList.overview.description') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ data.itemInformation.description }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.productionCode') }}:</span><span class="text-[#101828] text-sm font-medium">{{ data.itemInformation.productionCode
                        }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.productionName') }}:</span><span class="text-[#101828] text-sm font-medium">{{ data.itemInformation.productionName
                        }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.accessScope') }}:</span><span class="text-[#101828] text-sm font-medium">{{ data.itemInformation.accessScope }}</span>
                </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-5">
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.branch') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ data.itemInformation.branchName }}</span></div>
                <div class="flex justify-between items-center"><span
                        class="text-[#667085] text-sm">{{ $t('itemList.overview.warehouse') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ data.itemInformation.wareHouseName }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemGroup') }}:</span><span class="text-[#101828] text-sm font-medium">{{ data.itemInformation.groupName }}</span>
                </div>
                <div class="flex justify-between items-center"><span
                        class="text-[#667085] text-sm">{{ $t('itemList.overview.category') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ data.itemInformation.categoryName }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemType') }}:</span><span class="text-[#101828] text-sm font-medium">{{ data.itemInformation.itemType }}</span>
                </div>
                <div class="flex justify-between items-center"><span
                        class="text-[#667085] text-sm">{{ $t('itemList.overview.manufacturer') }}:</span><span
                        class="text-[#101828] text-sm font-medium">{{ data.itemInformation.manufacturer }}</span></div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.partNumber') }}:</span><span class="text-[#101828] text-sm font-medium">{{ data.itemInformation.manufacturerPartNumber }}</span>
                </div>
                <div class="flex justify-between items-center"><span class="text-[#667085] text-sm">{{ $t('itemList.overview.barcodeSku') }}:</span><span class="text-[#101828] text-sm font-medium">{{ data.itemInformation.barcode }}</span>
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
                    <span class="text-[#027A48] text-sm font-medium">{{ data.itemTrackingAndParameters.tracked ? 'Enabled' : 'Disabled' }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.reorderPoint') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemTrackingAndParameters.reorderPoint }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.reorderQuantity') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemTrackingAndParameters.reorderQuantity }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.leadTime') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemTrackingAndParameters.leadTime }}</span>
                </div>
            </div>
        </section>

        <!-- Groups -->
        <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">

            <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.groups') }}</h3>
            <div class="space-y-5">
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemGroup1') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemGroups.group1Name }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemGroup2') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemGroups.group2Name }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemGroup3') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemGroups.group3Name }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.itemGroup4') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemGroups.group4Name }}</span>
                </div>
            </div>
        </section>

        <!-- Units of Measure -->
        <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">

            <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.unitsOfMeasure') }}</h3>
            <div class="space-y-3">
                <div v-for="(uom, index) in data.itemUnitsOfMeasure" :key="index" class="bg-[#F0F3FA] p-4 rounded-lg flex justify-between items-center border border-gray-100">
                    <span class="font-bold text-[#101828]">{{ uom.unitName }}</span>
                    <span class="text-[#667085] text-sm">{{ uom.isBase ? '(Base Unit)' : `(Factor: ${uom.factor})` }}</span>
                </div>
            </div>
        </section>

        <!-- Cost Information -->
        <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">

            <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.costInformation') }}</h3>
            <div class="space-y-5">
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.movingAverage') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemCostInformation.lastMovingPrice }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.lastCost') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemCostInformation.lastPurchasePrice }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.standardCost') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemCostInformation.standardCost }}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[#667085] text-sm">{{ $t('itemList.overview.totalValue') }}:</span>
                    <span class="text-[#101828] text-sm font-medium">{{ data.itemCostInformation.totalValue }}</span>
                </div>
            </div>
        </section>
    </div>


    <!-- Item Attachment -->
    <section class="mb-4 border border-gray-200 p-4 rounded-[12px]">

        <h3 class="text-lg font-bold text-[#101828] mb-6">{{ $t('itemList.overview.itemAttachment') }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div v-for="(att, index) in data.itemAttachments" :key="index" @click="downloadFile(att.fileUrl)"
                class="border border-gray-200 rounded-lg p-3 flex gap-4 bg-white hover:bg-gray-50 transition cursor-pointer">
                <!-- Placeholder for preview -->
                <div
                    class="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img v-if="att.fileType.startsWith('image/')" :src="att.fileUrl" class="w-full h-full object-cover" />
                    <span v-else class="text-xs font-bold text-gray-500">FILE</span>
                </div>
                <div class="flex flex-col justify-center">
                    <span class="text-sm font-medium text-[#101828] truncate">{{ att.fileName }}</span>
                    <span class="text-xs text-[#667085]">{{ formatFileSize(att.fileSize) }}</span>
                </div>
            </div>
             <div v-if="data.itemAttachments.length === 0" class="text-gray-500 text-sm">
                {{ $t('itemList.overview.noAttachments') }}
            </div>
        </div>
    </section>
</template>