<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const data = ref([
  {
    id: "111-111-11",
    countID: "ITM-045",
    itemName: "Steel 10mm",
    warehouse: "ITM-045",
    availableBalance: "50 Pcs",
    counted: 40,
    variances: 40
  },
])

const columns = computed(() => {
  const Columns = [
    { field: 'countID', header: t('Count ID') },
    { field: 'itemName', header: t('Item') },
    { field: 'warehouse', header: t('PhysicalCount.warehouse') },
    { field: 'availableBalance', header: t('Available Balance') },
    { field: 'counted', header: t('Counted') },
    { field: 'variances', header: t('PhysicalCount.Variances') },
    { field: 'serial', header: t('Serial') },
  ];
  return Columns;
});

const getSerail = (id: string) => {
  alert(id)
};

</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="operation.title" actionName="View Physical Count" />
    <card class="bg-white rounded-[10px]">
      <!-- PageHeader component -->
      <template #title>
        <div class="flex justify-between mb-10">
          <div>
            <div class="flex gap-5 items-center">
              <p class="font-bold">{{ $t("New Physical Count") }}</p>
              <div class="rounded-lg text-primary-500 bg-primary-50 p-2 text-sm">
                ADJ-045
              </div>
            </div>
            <p class="text-gray-500">{{ $t("Compare system stock with actual physical count") }}</p>
          </div>
          <div>
            <BaseButton label="button.delete" variant="danger" icon="Trash" />
          </div>
        </div>
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-gray-500">{{ $t('Count Number') }}</p>
            <p>ADJ-045</p>
          </div>
          <div class="mb-5">
            <p class="text-gray-500">{{ $t("itemTransaction.notes") }}</p>
            <p>Revelant Notes</p>
          </div>
          <div class="mb-5">
            <p class="text-gray-500">{{ $t("Date") }}</p>
            <p>2025-01-01</p>
          </div>
        </div>
        <div class="my-5">
          <p class="text-xl">
            <strong>{{
              $t("Line Items")
            }}</strong>
          </p>
        </div>
        <div>
          <DynamicTable :columns="columns" :data="data" :paginator="false">
            <template v-slot:["col-serial"]="{ data }">
              <VsxIcon class="cursor-pointer text-primary-500" iconName="Eye" :size="24" type="linear"
                @click="getSerail(data.id as string)" />
            </template>
          </DynamicTable>
        </div>
      </template>
    </card>
  </div>
</template>
