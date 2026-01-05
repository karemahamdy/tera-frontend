<script setup lang="ts">
import { useRoute } from "vue-router";
import { useForm } from "vee-validate";
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import FileUpload from "@/sharedComponents/inputs/FileUpload.vue";
import FormInput from "@/sharedComponents/inputs/FormInput.vue";
import FormDropdown from "@/sharedComponents/inputs/FormDropdown.vue";
import ToggleItem from "@/sharedComponents/inputs/ToggleItem.vue";
import { userSchema, userEditSchema } from "../validation/UserSchema";
import { onMounted, ref } from "vue";
import { useLookups } from "@/composables/useLookups";
import { useUsers } from "../composables/useUsers";
import type { UserPayload } from "../types/User";

const {
  groupsLookups,
  departmentsLookups,
  getDepartmentsLookups,
  getGroupLookups,
} = useLookups();
const { createUser, editUser, userData, getUserById } = useUsers();
const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();
const id = route.params.id ? String(route.params.id) : null
const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: editMode ? userEditSchema : userSchema,
});
const file = ref<File | null>(null);

const [fullName] = defineField("fullName");
const [userName] = defineField("userName");
const [email] = defineField("email");
const [internalID] = defineField("internalID");
const [password] = defineField("password");
const [confirmPassword] = defineField("confirmPassword");
const [departmentID] = defineField("departmentID");
const [groupId] = defineField("groupId");
const [isAdmin] = defineField("isAdmin");
const [isActive] = defineField("isActive");

onMounted(() => {
  Promise.all([getGroupLookups(), getDepartmentsLookups()]);
});

const onSubmit = handleSubmit((values) => {
   if (file.value) {
    values.profileImage = file.value;
   }

  if (editMode) {
    editUser(id as string, values as UserPayload);
  } else {
    createUser(values as UserPayload);
  }
});

onMounted(async () => {
  if (editMode) {
    await getUserById(id as string);
    setValues(userData.value);
  }
});

</script>

<template>
  <div>
    <ScreenHeader
      title="accessControl"
      subtitle="usersManagement.usersManagement"
      :actionName="
        editMode
          ? $t('usersManagement.editUsersManagement')
          : $t('usersManagement.addNewUserManagement')
      "
    />

    <Card class="p-6 bg-white rounded-[10px]">
      <template #title>
        <div class="flex flex-col pt-4 px-20">
          <h2 class="heading-title">
            {{
              editMode
                ? $t("usersManagement.editUsersManagement")
                : $t("usersManagement.addNewUserManagement")
            }}
          </h2>
          <p class="subheading-title">
            {{
              editMode
                ? $t("usersManagement.updateUserInfo")
                : $t("usersManagement.addUserInfo")
            }}
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="onSubmit" class="space-y-6 px-20">
          <FileUpload v-model="file" />

          <div class="flex gap-8">
            <FormInput
              class="w-1/2"
              :label="$t('usersManagement.fullName')"
              v-model="fullName"
              :error="errors.fullName"
              :placeholder="$t('form.fullNamePlaceholder')"
            />

            <FormInput
              class="w-1/2"
              :label="$t('usersManagement.username')"
              v-model="userName"
              :error="errors.userName"
              :placeholder="$t('enterUsername')"
            />
          </div>

          <div class="flex gap-8">
            <FormInput
              class="w-1/2"
              :label="$t('auth.email')"
              v-model="email"
              :error="errors.email"
              placeholder="user@company.com"
            />

            <FormInput
              class="w-1/2"
              :label="$t('usersManagement.internalID')"
              v-model="internalID"
              :error="errors.internalID"
              :placeholder="$t('enterUserID')"
            />
          </div>

          <div class="flex gap-8" v-if="!editMode">
            <FormInput
              class="w-1/2"
              type="password"
              :label="$t('auth.password')"
              v-model="password"
              :error="errors.password"
              placeholder="****"
            />

            <FormInput
              class="w-1/2"
              type="password"
              :label="$t('auth.confirmPassword')"
              v-model="confirmPassword"
              :error="errors.confirmPassword"
              placeholder="****"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ToggleItem
              :title="$t('usersManagement.accountType')"
              label="Is Admin"
              v-model="isAdmin"
            />
            <ToggleItem
              :title="$t('usersManagement.accountStatus')"
              label="Active"
              v-model="isActive"
            />
          </div>

          <div class="flex gap-8">
            <FormDropdown
              class="w-1/2"
              :label="$t('usersManagement.department')"
              :options="departmentsLookups"
              v-model="departmentID"
              :error="errors.departmentID"
              optionValue="value"
              :placeholder="$t('usersManagement.departmentPlaceholder')"
            />

            <FormDropdown
              class="w-1/2"
              :label="$t('userGroup.userGroup')"
              :options="groupsLookups"
              v-model="groupId"
              :error="errors.groupId"
              optionValue="value"
              :placeholder="$t('usersManagement.userGroupPlaceholder')"
            />
          </div>

          <div class="flex gap-8">
            <BaseButton
              label="button.cancel"
              variant="ghost"
              block
              :to="{ name: 'UserManagement' }"
            />
            <BaseButton
              :label="editMode ? 'button.save' : 'usersManagement.addUser'"
              variant="primary"
              block
              type="submit"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>
<style scoped></style>
