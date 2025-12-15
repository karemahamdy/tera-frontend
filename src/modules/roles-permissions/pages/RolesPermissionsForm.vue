<script setup lang="ts">
import { ref } from "vue";
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();
const id = ref<string | null>(route.params.id ? String(route.params.id) : null);
const name = ref<string>("");
const description = ref<string>("");

const handleSubmit = () => {
  console.log(`form submited ${id.value}`);
};

const data = ref([
  {
    id: 1,
    module: "User Management",
    view: true,
    create: true,
    edit: false,
    delete: false,
    data: [
      {
        permission: "Create User",
        view: true,
        create: true,
        edit: false,
        delete: false,
      },
      {
        permission: "Edit User",
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        permission: "Delete User",
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
    ],
  },
  {
    id: 2,
    module: "Role Management",
    view: true,
    create: true,
    edit: false,
    delete: false,
    data: [
      {
        permission: "Create Role",
        view: true,
        create: true,
        edit: false,
        delete: false,
      },
      {
        permission: "Edit Role",
        view: true,
        create: false,
        edit: true,
        delete: false,
      },
      {
        permission: "Delete Role",
        view: true,
        create: false,
        edit: false,
        delete: true,
      },
    ],
  },
]);
</script>
<template>
  <div>
    <ScreenHeader title="Access Control" subtitle="roles.rolesPermissions" />
    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col">
          <h2 class="heading-title">
            {{ editMode ? $t("roles.editRole") : $t("roles.addNewRole") }}
          </h2>
          <p class="subheading-title">
            {{
              editMode ? $t("roles.updateRoleInfo") : $t("roles.addRoleInfo")
            }}
          </p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="text-gray-700 font-medium mb-2 block">{{
              $t("roles.roleName")
            }}</label>
            <InputText
              v-model="name"
              placeholder="e.g., Finance Manager"
              class="mt-1 w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label class="text-gray-700 font-medium mb-2 block">{{
              $t("userGroup.description")
            }}</label>
            <Textarea
              v-model="description"
              :placeholder="$t('roles.descriptionPlaceholder')"
              class="mt-1 w-full p-3 border border-gray-300 rounded-lg"
              rows="4"
            />
          </div>

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
              <Accordion value="0">
                <template v-for="(item, index) in data" :key="item.id">
                  <AccordionPanel :value="String(index)">
                    <AccordionHeader class="bg-[#F0F3FA]">
                      <div
                        class="grid grid-cols-5 justify-between items-center w-full p-2"
                      >
                        <div class="font-bold">{{ item.module }}</div>
                        <div class="m-auto">
                          <Checkbox v-model="item.view" binary @click.stop />
                        </div>
                        <div class="m-auto">
                          <Checkbox v-model="item.create" binary @click.stop />
                        </div>
                        <div class="m-auto">
                          <Checkbox v-model="item.edit" binary @click.stop />
                        </div>
                        <div class="m-auto">
                          <Checkbox v-model="item.delete" binary @click.stop />
                        </div>
                      </div>
                    </AccordionHeader>
                    <AccordionContent>
                      <div
                        v-for="permission in item.data"
                        class="grid grid-cols-5 justify-between items-center w-content p-2"
                      >
                        <div class="font-medium">
                          {{ permission.permission }}
                        </div>
                        <div class="m-auto">
                          <Checkbox v-model="permission.view" binary />
                        </div>
                        <div class="m-auto">
                          <Checkbox v-model="permission.create" binary />
                        </div>
                        <div class="m-auto">
                          <Checkbox v-model="permission.edit" binary />
                        </div>
                        <div class="m-auto">
                          <Checkbox v-model="permission.delete" binary />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionPanel>
                </template>
              </Accordion>
            </div>
          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
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
</style>
