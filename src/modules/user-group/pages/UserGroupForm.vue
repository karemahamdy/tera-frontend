<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import { useRoute } from "vue-router";

import { useForm } from "vee-validate";
import { groupFormSchema } from "../validation/GroupsSchema";

const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();

// const groupId = route.params.id
//   ? String(route.params.id)
//   : null;

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: groupFormSchema,
  initialValues: {
    groupName: "",
    description: "",
  },
});

const [groupName] = defineField("groupName");
const [description] = defineField("description");
const onSubmit = handleSubmit((values) => {
  console.log(route);
  console.log("Form Values", values);
});
</script>

<template>
  <div>
    <ScreenHeader title="accessControl" subtitle="userGroup.userGroup" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("userGroup.editUserGroup") : $t("userGroup.addNewUserGroup") }}
          </h2>
          <p class="subheading-title">
            {{ $t("userGroup.userGroupInfo") }}
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="onSubmit" class="space-y-6 px-20">
          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("userGroup.groupName") }}
            </label>

            <InputText v-model="groupName" placeholder="e.g., Finance Team" class="mt-1 w-full p-3 border rounded-lg"
              :class="{ 'border-danger-500': errors.groupName }" />

            <small v-if="errors.groupName" class="text-danger-500">
              {{ errors.groupName }}
            </small>
          </div>
          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("userGroup.description") }}
            </label>

            <Textarea v-model="description" :placeholder="$t('userGroup.descriptionPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.description }" />

            <small v-if="errors.description" class="text-danger-500">
              {{ errors.description }}
            </small>
          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'UserGroup' }" />

            <BaseButton type="submit" :label="editMode ? 'button.save' : 'userGroup.createGroup'" variant="primary"
              block />
          </div>

        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>
