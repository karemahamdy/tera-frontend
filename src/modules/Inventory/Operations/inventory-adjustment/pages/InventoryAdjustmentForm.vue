<template>
  <ScreenHeader
    title="inventory"
    subtitle="operation.title"
    actionName="InventoryAdjustment.InventoryAdjustment"
  />
  <card class="bg-[#ffffff] rounded-[10px]">
    <!-- PageHeader component -->
    <template #title>
      <PageHeader
        title="InventoryAdjustment.createNewAdjustment"
        subtitle="InventoryAdjustment.subtitle"
        :showSearch="false"
      />
    </template>
    <!-- DynamicTable component -->
    <template #content> </template>
  </card>
</template>
