<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import { useRoute } from "vue-router";
import NoData from "../components/NoData.vue";
import type { Permission } from "../types/roles";
import { useRolesStore } from "../store/useRolesStore";
const store = useRolesStore();

const props = defineProps<{
  mode: "edit" | "create" | "view";
}>();

const editMode = props.mode === "edit";
const isView = props.mode === "view";
const route = useRoute();
const id = ref<string | null>(route.params.id ? String(route.params.id) : null);
const search = ref<string>("");
const handleSubmit = () => {
  console.log(`form submited ${id.value}`);
};

const data = ref<Permission[]>([]);

// Computed property to filter modules and permissions based on search
const filteredData = computed(() => {
  if (!search.value) return data.value;

  const term = search.value.toLowerCase();

  return data.value
    .map((moduleItem) => {
      // Filter module's permissions
      const filteredPermissions = moduleItem.permissionDtos.filter((perm) =>
        perm.name.toLowerCase().includes(term)
      );

      // Include module if module name matches OR it has matching permissions
      if (
        moduleItem.moduleCode.toLowerCase().includes(term) ||
        filteredPermissions.length
      ) {
        return {
          ...moduleItem,
          data: filteredPermissions,
        };
      }

      return null;
    })
    .filter(Boolean); // remove nulls
});

onMounted(async () => {
  if ((editMode || isView) && typeof id.value === "string") {
    await store.getItemById(id.value);
    data.value = store.role.treeOfPermissions;
  }
});
</script>
<template>
  <div>
    <ScreenHeader title="Access Control" subtitle="roles.rolesPermissions" />
    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            <span v-if="editMode">{{ $t("roles.editRole") }}</span>
            <span v-else-if="isView">{{
              $t("roles.systemAdministrator")
            }}</span>
            <span v-else>{{ $t("roles.addNewRole") }}</span>
          </h2>
          <p class="subheading-title">
            <span v-if="editMode">{{ $t("roles.updateRoleInfo") }}</span>
            <span v-else-if="isView">{{ $t("roles.viewInfo") }}</span>
            <span v-else>{{ $t("roles.addRoleInfo") }}</span>
          </p>
        </div>
      </template>
      <template #content>
        <div class="px-20">
          <div v-if="isView">
            <div
              class="text-gray-500 flex items-center gap-2 border border-gray-300 px-2 rounded-lg search-container"
            >
              <VsxIcon iconName="SearchNormal" :size="24" type="linear" />
              <InputText
                v-model="search"
                :placeholder="$t('roles.searchViewPlaceholder')"
                class="w-full p-3 search-input"
              />
            </div>
          </div>
          <form @submit.prevent="handleSubmit" class="space-y-6 mt-5">
            <template v-if="!isView">
              <div>
                <label class="text-gray-700 font-medium mb-2 block">{{
                  $t("roles.roleName")
                }}</label>
                <InputText
                  v-model="store.role.name"
                  :disabled="isView"
                  placeholder="e.g., Finance Manager"
                  class="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label class="text-gray-700 font-medium mb-2 block">{{
                  $t("userGroup.description")
                }}</label>
                <Textarea
                  v-model="store.role.description"
                  :disabled="isView"
                  :placeholder="$t('roles.descriptionPlaceholder')"
                  class="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                  rows="4"
                />
              </div>
            </template>

            <div class="p-5 border border-[#DCDCDC4D] bg-[#FAF9F9] rounded">
              <div class="">
                <div
                  class="grid grid-cols-5 justify-between items-center w-content p-5"
                >
                  <div class="font-bold">{{ $t("roles.moduleScreen") }}</div>
                  <div class="font-bold m-auto">{{ $t("button.view") }}</div>
                  <div class="font-bold m-auto">{{ $t("button.create") }}</div>
                  <div class="font-bold m-auto">{{ $t("button.edit") }}</div>
                  <div class="font-bold m-auto">{{ $t("button.delete") }}</div>
                </div>
                <Accordion value="0" v-if="filteredData.length > 0">
                  <template
                    v-for="(item, index) in filteredData"
                    :key="item?.moduleCode"
                  >
                    <AccordionPanel v-if="item" :value="String(index)">
                      <AccordionHeader class="bg-[#F0F3FA]">
                        <div
                          class="grid grid-cols-5 justify-between items-center w-full p-2"
                        >
                          <div class="font-bold">{{ item?.moduleCode }}</div>
                          <div class="m-auto">
                            <Checkbox
                              :disabled="isView"
                              v-model="item.isView"
                              binary
                              @click.stop
                            />
                          </div>
                          <div class="m-auto">
                            <Checkbox
                              :disabled="isView"
                              v-model="item.isCreate"
                              binary
                              @click.stop
                            />
                          </div>
                          <div class="m-auto">
                            <Checkbox
                              :disabled="isView"
                              v-model="item.isUpdate"
                              binary
                              @click.stop
                            />
                          </div>
                          <div class="m-auto">
                            <Checkbox
                              :disabled="isView"
                              v-model="item.isDelete"
                              binary
                              @click.stop
                            />
                          </div>
                        </div>
                      </AccordionHeader>
                      <AccordionContent>
                        <div
                          v-for="permission in item?.permissionDtos"
                          class="grid grid-cols-5 justify-between items-center w-content p-2"
                        >
                          <div class="font-medium">
                            {{ permission.name }}
                          </div>
                          <div class="m-auto">
                            <Checkbox
                              :disabled="isView"
                              v-model="permission.isView"
                              binary
                            />
                          </div>
                          <div class="m-auto">
                            <Checkbox
                              :disabled="isView"
                              v-model="permission.isCreate"
                              binary
                            />
                          </div>
                          <div class="m-auto">
                            <Checkbox
                              :disabled="isView"
                              v-model="permission.isUpdate"
                              binary
                            />
                          </div>
                          <div class="m-auto">
                            <Checkbox
                              :disabled="isView"
                              v-model="permission.isDelete"
                              binary
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionPanel>
                  </template>
                </Accordion>
                <NoData v-else />
              </div>
            </div>

            <div class="flex justify-between gap-4 mb-4 w-full" v-if="!isView">
              <BaseButton
                label="button.cancel"
                variant="ghost"
                block
                :to="{ name: 'RolesPermissions' }"
              />
              <BaseButton
                :label="editMode ? 'button.save' : 'roles.createRole'"
                variant="primary"
                block
              />
            </div>
          </form>
        </div>
      </template>
    </card>
  </div>
</template>
<style scoped>
:deep(.p-accordionheader) {
  background: #f0f3fa !important;
}
.w-content {
  width: calc(100% - 14px);
}
.search-container :deep(.p-inputtext, .p-inputtext:focus) {
  border: 0;
}
</style>
