<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { groupFormSchema } from "../validation/GroupsSchema";
import { GroupService } from "../services/groupService";
import { toastService } from "../../../app/services/toastService";
import type { AddGroup } from "../types/groups";

const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const groupId = route.params.id ? String(route.params.id) : null;

const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: groupFormSchema,
  initialValues: {
    groupName: "",
    description: "",
  },
});

const [groupName] = defineField("groupName");
const [description] = defineField("description");

// Fetch group data if in edit mode
onMounted(async () => {
  if (editMode && groupId) {
    try {
      const groupData = await GroupService.getById(groupId);
      setValues({
        groupName: groupData.name,
        description: groupData.description || "",
      });
    } catch (error) {
      console.error("Error fetching group:", error);
      toastService.error("Failed to load group data");
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
      await GroupService.update(groupId, payload);
      toastService.success("Group updated successfully");
    } else {
      await GroupService.create(payload);
      toastService.success("Group created successfully");
    }
    router.push({ name: "UserGroup" });
  } catch (error) {
    console.error("Error submitting form:", error);
    toastService.error(
      editMode ? "Failed to update group" : "Failed to create group"
    );
  } finally {
    isSubmitting.value = false;
  }
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
            <FormInput :label="$t('userGroup.groupName')" v-model="groupName" :error="errors.groupName"
              placeholder="Enter full name" :invalid="!!errors.groupName" />
          </div>

          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("userGroup.description") }}
            </label>

            <Textarea v-model="description" :placeholder="$t('userGroup.descriptionPlaceholder')"
              class="mt-1 w-full p-3 border rounded-4xl" rows="4" :disabled="isSubmitting"
              :invalid="!!errors.description" />

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