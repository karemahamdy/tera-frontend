<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { groupFormSchema } from "../validation/GroupsSchema";
import { useGroups } from "../composables/useGroups";
import type { AddGroup } from "../types/groups";

const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const groupId = route.params.id ? String(route.params.id) : null;

const { fetchGroupById, createGroup, updateGroup } = useGroups();

const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: groupFormSchema,
  initialValues: {
    groupName: "",
    description: "",
  },
});

const [groupName] = defineField("groupName");
const [description] = defineField("description");

onMounted(async () => {
  if (editMode && groupId) {
    const groupData = await fetchGroupById(groupId);
    if (groupData) {
      setValues({
        groupName: groupData.name,
        description: groupData.description || "",
      });
    }
  }
});

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;

  const payload: AddGroup = {
    name: values.groupName,
    description: values.description,
  };

  try {
    if (editMode && groupId) {
      await updateGroup(groupId, payload);
    } else {
      await createGroup(payload);
    }
    router.push({ name: "UserGroup" });
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <div>
    <ScreenHeader title="accessControl" subtitle="userGroup.userGroup" :actionName="editMode ? $t('userGroup.editUserGroup') : $t('userGroup.addNewGroup')" />
    
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
            <FormInput :label="$t('userGroup.groupName')" v-model="groupName" :error="errors.groupName"
              placeholder="Enter full name" :invalid="!!errors.groupName" />
          </div>

          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("userGroup.description") }}
            </label>

            <Textarea v-model="description" :placeholder="$t('userGroup.descriptionPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.description }"
              :disabled="isSubmitting" />

            <small v-if="errors.description" class="text-danger-500">
              {{ errors.description }}
            </small>
          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'UserGroup' }"
              :disabled="isSubmitting" />

            <BaseButton type="submit" :label="editMode ? 'button.save' : 'userGroup.createGroup'" variant="primary"
              block :disabled="isSubmitting" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>