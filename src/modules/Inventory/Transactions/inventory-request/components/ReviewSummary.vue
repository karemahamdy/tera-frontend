<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const props = defineProps<{
  requestBy: string
  sourceWarehouse: string
  type: string
  requestDate: string
  sourceWhCode: string
  targetWhCode: string
}>()

const items = ref([
  {
    id: 1,
    code: 'ITM-001',
    name: 'Hydraulic Pump',
    quantity: 0,
    uom: 'PCS'
  },
  {
    id: 2,
    code: 'ITM-045',
    name: 'Industrial 6205',
    quantity: 0,
    uom: 'PCS'
  }
])

const columns = computed(() => [
  { field: 'code', header: t('itemsList.itemCode') },
  { field: 'name', header: t('itemsList.itemName') },
  { field: 'uom', header: t('itemsList.uom') },
  { field: 'quantity', header: t('itemsList.quantity') },
])

// ترجمة للعرض فقط — بدون تغيير القيمة الأصلية
const translatedType = computed(() => {
  return t(`RequestInformation.types.${props.type}`)
})
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
            {{ props.requestBy }}
          </span>

          <span class="text-gray-500">
            {{ t('RequestInformation.SourceWarehouse') }}
          </span>
          <span class="text-gray-700 font-medium text-right">
            {{ props.sourceWarehouse }}
          </span>

          <span class="text-gray-500">
            {{ t('RequestInformation.Type') }}
          </span>

          <!-- النوع بدون تغيير قيمته -->
          <span
            v-if="props.type === 'Transfer'"
            class="flex justify-end rounded gap-1 p-1 text-sm bg-primary-50 text-primary-500"
          >
            <VsxIcon iconName="ArrowSwapHorizontal" type="linear" />
            <span>Transfer</span>
          </span>

          <span
            v-else-if="props.type === 'Inbound'"
            class="flex justify-end rounded gap-1 p-1 text-sm bg-success-50 text-success-500"
          >
            <VsxIcon iconName="ArrowDown" type="linear" />
            <span>Inbound</span>
          </span>

          <span
            v-else
            class="flex justify-end rounded gap-1 p-1 text-sm bg-danger-50 text-danger-500"
          >
            <VsxIcon iconName="ArrowUp" type="linear" />
            <span>Inbound</span>
          </span>

          <span class="text-gray-500">
            {{ t('RequestInformation.RequestDate') }}
          </span>
          <span class="text-gray-700 font-medium text-right">
            {{ props.requestDate }}
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
            {{ props.sourceWhCode }}
          </span>

          <span class="text-gray-500">
            {{ t('RequestInformation.TargetWarehouse') }}
          </span>
          <span class="text-gray-700 font-medium text-right">
            {{ props.targetWhCode }}
          </span>

        </div>
      </div>
    </div>

    <DynamicTable
      :columns="columns"
      :data="items"
      :paginator="false"
      :showView="false"
      :showEdit="false"
      :showDelete="false"
    >
    <template #col-code="{ data }">
                    <div class="flex items-center gap-2 rounded">
                        <Badge v-if="!data.tracked" severity="success" class="circle-badge-sm">
                            <VsxIcon iconName="Airdrop" :size="20" type="linear" />
                        </Badge>
                        <Badge v-else severity="transparent" class="circle-badge">
                            <VsxIcon iconName="Airdrop" :size="20" type="linear" class="icon-transparent" />
                        </Badge>
                        <div class="text-base text-gray-700">{{ data.code }}</div>
                    </div>
                </template>
</DynamicTable>
  </div>
</template>
