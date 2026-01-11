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
import { toastService } from "@/app/services/toastService";

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
const id = route.params.id ? String(route.params.id) : null;
const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: editMode ? userEditSchema : userSchema,
});
const file = ref<File | null>(null);
const fileUploadRef = ref<InstanceType<typeof FileUpload> | null>(null);
const isCopied = ref<boolean>(false);
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

const quickFill = () => {
  isCopied.value = false;
  const chars = "!@#$%^&*";
  password.value =
    Math.random().toString(36).slice(-4) +
    Math.random().toString(36).slice(-4).toUpperCase() +
    chars[Math.floor(Math.random() * chars.length)];
  confirmPassword.value = password.value;
};

const copyPassword = async () => {
  isCopied.value = true;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(password.value);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = password.value;
      textarea.style.position = "fixed"; // avoid scrolling
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    toastService.success("Copied");
  } catch (err) {
    toastService.error("Copy failed");
  }
};


onMounted(async () => {
  if (editMode) {
    await getUserById(id as string);
    setValues(userData.value);
    if (userData.value.userProfileImageUrl && fileUploadRef.value) {
      fileUploadRef.value.setSelectedImage(userData.value.userProfileImageUrl);
    }
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
          <FileUpload ref="fileUploadRef" v-model="file" />

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
            <div
              class="w-1/2 flex justify-center gap-2"
              :class="{
                'items-center': !!errors.password,
                'items-end': !errors.password,
              }"
            >
              <FormInput
                class="w-3/4"
                type="password"
                :label="$t('auth.password')"
                v-model="password"
                :error="errors.password"
                placeholder="****"
              />
              <div
                class="p-3 border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-xl w-1/4 text-center cursor-pointer flex items-center"
                @click="quickFill"
              >
                <VsxIcon iconName="Magicpen" />
                {{ $t("usersManagement.quickFill") }}
              </div>
            </div>
            <div
              class="w-1/2 flex justify-center gap-2"
              :class="{
                'items-center': !!errors.password,
                'items-end': !errors.password,
              }"
            >
              <FormInput
                class="w-4/5"
                type="password"
                :label="$t('auth.confirmPassword')"
                v-model="confirmPassword"
                :error="errors.confirmPassword"
                placeholder="****"
              />
              <VsxIcon
                :iconName="isCopied ? 'CopySuccess' : 'Copy'"
                :size="36"
                type="linear"
                class="cursor-pointer w-1/5"
                :class="isCopied ? 'text-success-500' : 'text-primary-500'"
                @click="copyPassword"
              />
            </div>
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
