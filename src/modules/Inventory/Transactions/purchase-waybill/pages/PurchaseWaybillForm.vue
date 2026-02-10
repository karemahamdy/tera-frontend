<script setup lang="ts">
import SupplierDetails from '../components/SupplierDetails.vue';
import WarehouseDetails from '../components/WarehouseDetails.vue';


</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
              <ScreenHeader title="inventory" subtitle="masterData" actionName="purchaseWaybill.purchaseWaybill" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <template #title>
           
            </template>
            <template #content>
             <SupplierDetails/>
            </template>
            <template #footer>
            <WarehouseDetails/>
           </template>
        </card>
    </div>
</template>

<style scoped>

</style>