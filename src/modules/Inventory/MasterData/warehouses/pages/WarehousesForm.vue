<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { warehousesSchema } from "../validation/warehousesSchema";
import WarehouseZones from "../components/WarehouseZones.vue";

const activeTab = ref("basic");

const props = defineProps<{
  mode: "edit" | "create" | "view";
}>();

const editMode = props.mode === "edit";
const isSubmitting = ref(false);

const { errors, defineField } = useForm({
  validationSchema: warehousesSchema,
  initialValues: {
    warehousesNameAr: "",
    warehousesNameEn: "",
    code: "",
    description: "",
    address: "",
    isActive: false,
    zones: []
  }
});

const accountsOptions = ref([
  { label: "Account 1", value: 1 },
  { label: "Account 2", value: 2 }
]);

const [warehousesNameAr] = defineField("warehousesNameAr");
const [warehousesNameEn] = defineField("warehousesNameEn");
const [code] = defineField("code");
const [address] = defineField("address");
const [description] = defineField("description");
const [isActive] = defineField("isActive");
const [zones] = defineField("zones");
</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="masterData" actionName="warehouses.title" />

    <Card class="p-6 bg-white rounded-[10px]">
      <!-- TITLE -->
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("warehouses.editWarehouseInfo") : $t("warehouses.addWarehouseInfo") }}
          </h2>
          <p class="subheading-title">
            {{ editMode ? $t("warehouses.editWarehouseInfoDesc") : $t("warehouses.addWarehouseInfoDesc") }}
          </p>
        </div>
      </template>

      <!-- CONTENT -->
      <template #content>
        <Tabs v-model:value="activeTab">
          <!-- TAB HEADERS -->
          <TabList>
            <Tab value="basic">
              {{ $t("warehouses.basicInfo") }}
            </Tab>
            <Tab value="additional">
              {{ $t("warehouses.zonseInfo") }}
            </Tab>
          </TabList>

          <!-- TAB PANELS -->
          <TabPanels>
            <!-- TAB 1 : BASIC INFO -->
            <TabPanel value="basic">
              <form class="space-y-6 px-20">
                <div class="flex gap-4">
                  <FormInput class="w-1/2" :label="$t('warehouses.code')" v-model="code" :error="errors.code"
                    :invalid="!!errors.code" placeholder="WH-MAIN-001" />

                  <FormInput class="w-1/2" :label="$t('warehouses.name')" v-model="warehousesNameEn"
                    :error="errors.warehousesNameEn" :invalid="!!errors.warehousesNameEn"
                    placeholder="Main Central Warehouse" />
                </div>

                <div class="flex gap-4">
                  <FormInput class="w-1/2" :label="$t('itemGroup.itemGroupNameAr')" v-model="warehousesNameAr"
                    :error="errors.warehousesNameAr" :invalid="!!errors.warehousesNameAr"
                    placeholder="المستودع الرئيسي" />

                  <FormInput class="w-1/2" :label="$t('branch.address')" v-model="address" :error="errors.address"
                    :invalid="!!errors.address" placeholder="Industrial Zone, Block 5, Cairo – Egypt" />
                </div>

                <div class="flex gap-4">
                  <FormDropdown class="w-1/2" :label="$t('warehouses.manager')" :options="accountsOptions"
                    placeholder="Ahmed Hassan" />

                  <FormDropdown class="w-1/2" :label="$t('warehouses.warehouseType')" :options="accountsOptions"
                    placeholder="Normal" />
                </div>

                <div>
                  <label class="block mb-2 font-medium">
                    {{ $t("itemGroup.description") }}
                  </label>

                  <Textarea v-model="description" rows="2" class="w-full p-3 border rounded-lg"
                    :class="{ 'border-danger-500': errors.description }" />

                  <small v-if="errors.description" class="text-danger-500">
                    {{ $t(errors.description) }}
                  </small>
                </div>

                <div class="flex gap-4">
                  <FormDropdown class="w-1/2" :label="$t('warehouses.operationHours')" :options="accountsOptions"
                    placeholder="8:00 AM – 6:00 PM" />

                  <FormDropdown class="w-1/2" :label="$t('warehouses.LDC')" :options="accountsOptions"
                    placeholder="LDC-INV-001" />
                </div>

                <div class="flex gap-4 items-center">
                  <FormDropdown class="w-1/2" :label="$t('warehouses.transferAccount')" :options="accountsOptions"
                    placeholder="1305 – Warehouse Transfer Account" />

                  <ToggleItem class="w-1/2" :title="$t('warehouses.warehouseStatus')" label="Active"
                    v-model="isActive" />
                </div>
              </form>
            </TabPanel>

            <!-- TAB 2 : ADDITIONAL INFO -->
            <TabPanel value="additional">
              <WarehouseZones v-model="zones" />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <!-- ACTION BUTTONS -->
        <div class="flex gap-4 px-20 mt-6">
          <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'warehouses' }" />

          <BaseButton type="submit" :label="editMode ? 'button.save' : 'button.create'" variant="primary" block
            :loading="isSubmitting" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
:deep(.p-tab) {
  padding: 10px 20px;
  font-weight: 500;
  color: #3F5FAC;
  background: transparent;
  transition: all 0.2s ease;
}
:deep(.p-tab.p-highlight) {
  background: #ffffff;
  color: #3F5FAC !important;
}
</style>