<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from "vue-i18n"
import { useLookups } from "@/composables/useLookups";
import { useInventoryLookups } from "@/composables/useInventoryLookups";

const { t } = useI18n()

const { formData } = defineProps<{
  formData: any
}>()

const { usersLookups, getUsersLookups } = useLookups();
const { WarehouseLookups, getWarehouseLookups, UnitsLookups, getUnitsLookups } = useInventoryLookups()

onMounted(() => {
  getUsersLookups();
  getWarehouseLookups();
  getUnitsLookups();
});

const requestedByName = computed(() => {
  const user = usersLookups.value?.find(u => u.value === formData.requestedBy);
  return user ? user.label : formData.requestedBy;
});

const sourceWarehouseName = computed(() => {
  const wh = WarehouseLookups.value?.find(w => w.value === formData.warehouseId);
  return wh ? wh.label : formData.warehouseId;
});

const targetWarehouseName = computed(() => {
  const wh = WarehouseLookups.value?.find(w => w.value === formData.destinationWarehouseId);
  return wh ? wh.label : formData.destinationWarehouseId;
});

const mappedItems = computed(() => {
  return (formData.lineItems || []).map((item: any) => {
    const unitId = item.unitId || item.unitOfMeasureId;
    let uomName = item.uom || item.unitName || item.unitOfMeasureName;
    
    // Resolve from lookups if missing
    if (!uomName && unitId && UnitsLookups.value.length > 0) {
      const found = UnitsLookups.value.find(u => u.value === unitId);
      if (found) uomName = found.label;
    }
    
    return {
      ...item,
      code: item.code || item.itemCode,
      name: item.name || item.itemName,
      uom: uomName || unitId, // Fallback to ID if name still missing
      quantity: item.quantity
    };
  });
});

const columns = computed(() => [
  { field: 'code', header: t('itemsList.itemCode') },
  { field: 'name', header: t('itemsList.itemName') },
  { field: 'uom', header: t('itemsList.uom') },
  { field: 'quantity', header: t('itemsList.quantity') },
])

</script>

<template>
  <div class="rounded-xl">

    <!-- Title -->
    <h2 class="text-lg font-semibold text-gray-700 mb-4">
      {{ t('RequestInformation.ReviewSummary') }}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

      <!-- Requestor & Department -->
      <div class="bg-primary-25 rounded-2xl p-5">
        <h3 class="font-semibold text-gray-700 mb-4">
          {{ t('RequestInformation.RequestorDepartment') }}
        </h3>

        <div class="grid grid-cols-2 gap-y-3 text-sm">

          <span class="text-gray-500">
            {{ t('RequestInformation.RequestBy') }}
          </span>
          <span class="text-gray-700 font-medium text-right">
            {{ requestedByName }}
          </span>

          <span class="text-gray-500">
            {{ t('RequestInformation.Type') }}
          </span>

          <span v-if="formData.type === 'Transfer'"
            class="flex justify-end w-24 mx-30 rounded gap-1 p-1 text-sm bg-primary-50 text-primary-500">
            <VsxIcon iconName="ArrowSwapHorizontal" type="linear" />
            <span>Transfer</span>
          </span>

          <span v-else-if="formData.type === 'Inbound'"
            class="flex justify-end w-24 mx-30 rounded gap-1 p-1 text-sm bg-success-50 text-success-500">
            <VsxIcon iconName="ArrowDown" type="linear" />
            <span>Inbound</span>
          </span>

          <span v-else-if="formData.type === 'Outbound'"
            class="flex justify-end  w-24 mx-30 rounded gap-1 p-1 text-sm bg-danger-50 text-danger-500">
            <VsxIcon iconName="ArrowUp" type="linear" />
            <span>Outbound</span>
          </span>

          <span v-else class="flex justify-end rounded gap-1 p-1 text-sm  text-primary-500">

            <span>--</span>
          </span>

          <span class="text-gray-500">
            {{ t('RequestInformation.RequestDate') }}
          </span>
          <span class="text-gray-700 font-medium text-right">
            {{ formData.requestDate.toLocaleDateString() }}
          </span>

        </div>
      </div>

      <!-- Warehouse Details -->
      <div class="bg-primary-25 rounded-2xl p-5">
        <h3 class="font-semibold text-gray-700 mb-4">
          {{ t('RequestInformation.WarehouseDetails') }}
        </h3>

        <div class="grid grid-cols-2 gap-y-3 text-sm">

          <span class="text-gray-500">
            {{ t('RequestInformation.SourceWarehouse') }}
          </span>
          <span class="text-gray-700 font-medium text-right">
            {{ sourceWarehouseName }}
          </span>

          <template v-if="formData.locationCode">
            <span class="text-gray-500">{{ t('itemList.zone') }}</span>
            <span class="text-gray-700 font-medium text-right">{{ formData.locationCode }}</span>
          </template>

          <span class="text-gray-500">
            {{ t('RequestInformation.TargetWarehouse') }}
          </span>
          <span class="text-gray-700 font-medium text-right">
            {{ targetWarehouseName }}
          </span>

          <template v-if="formData.destinationLocationCode">
            <span class="text-gray-500">{{ t('itemList.zone') }}</span>
            <span class="text-gray-700 font-medium text-right">{{ formData.destinationLocationCode }}</span>
          </template>

        </div>
      </div>
    </div>

    <DynamicTable :columns="columns" :data="mappedItems" :paginator="false" :showView="false" :showEdit="false"
      :showDelete="false">
      <template #col-code="{ data }">
        <div class="flex items-center gap-2 rounded">
          <Badge v-if="!data.tracked" severity="success" class="circle-badge-sm">
           <VsxIcon iconName="Brodcast" :size="20" type="linear" />
          </Badge>
          <Badge v-else severity="transparent" class="circle-badge">
            <VsxIcon iconName="Brodcast" :size="20" type="linear" />
          </Badge>
          <div class="text-base text-gray-700">{{ data.code }}</div>
        </div>
      </template>
    </DynamicTable>
  </div>
</template>
<style scoped>
.circle-badge-sm {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
}

.circle-badge {
    background-color: transparent;
}

.icon-transparent {
    color: transparent;
}
</style>