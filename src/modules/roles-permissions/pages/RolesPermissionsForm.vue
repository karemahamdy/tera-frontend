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

          <div>
            <div class="row justify-between items-center">
              <div class="col-12 md:col-3 lg:col-3 font-medium">
                {{ $t("roles.permission") }}
              </div>
              <div class="col-12 md:2 lg:2 font-medium text-center">
                {{ $t("roles.view") }}
              </div>
              <div class="col-12 md:2 lg:2 font-medium text-center">
                {{ $t("roles.create") }}
              </div>
              <div class="col-12 md:2 lg:2 font-medium text-center">
                {{ $t("roles.edit") }}
              </div>
              <div class="col-12 md:2 lg:2 font-medium text-center">
                {{ $t("roles.delete") }}
              </div>
            </div>
            <div class="card">
              <Accordion value="0">
                <template v-for="(item, index) in data" :key="item.id">
                  <AccordionPanel :value="String(index)">
                    <AccordionHeader>{{ item.module }}</AccordionHeader>
                    <AccordionContent>
                      <div
                        class="row justify-between items-center"
                        v-for="permission in item.data"
                      >
                        <div class="col-12 md:col-3 lg:col-3 font-medium">
                          {{ permission.permission }}
                        </div>
                        <div class="col-12 md:2 lg:2 font-medium text-center">
                          <Checkbox v-model="permission.view" />
                        </div>
                        <div class="col-12 md:2 lg:2 font-medium text-center">
                          <Checkbox v-model="permission.create" />
                        </div>
                        <div class="col-12 md:2 lg:2 font-medium text-center">
                          <Checkbox v-model="permission.edit" />
                        </div>
                        <div class="col-12 md:2 lg:2 font-medium text-center">
                          <Checkbox v-model="permission.delete" />
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
<style scoped></style>
