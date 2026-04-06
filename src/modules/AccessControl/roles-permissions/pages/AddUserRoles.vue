<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useForm, useField } from "vee-validate";
import { assignRolesSchema } from "../validation/UserAssignRolesSchema";
import { useRolesUser } from "../composables/assignRolesToUser";
import { useLookups } from "@/composables/useLookups";
import { toastService } from "@/app/services/toastService";
const { userData, getUserById } = useUsers();
import type { AssignRole } from "../types/user";
import { useI18n } from "vue-i18n";
import { useUsers } from "../../user-management/composables/useUsers";
const { t } = useI18n();

const route = useRoute();
const userId = route.params.id as string;
const roleId = route.params.roleId as string | undefined;
const isSubmitting = ref(false);
const isEditMode = computed(() => !!roleId);

const { assignRole, getRoleToUserById, role, updateAssignRole } = useRolesUser();
const {
  getRolesLookups,
  getBranchLookups,
  rolesLookups,
  branchesLookups,
} = useLookups();

const { handleSubmit, setValues, errors } = useForm({
  validationSchema: assignRolesSchema,
  initialValues: {
    name: "",
    role: [] as string[],
    branchIds: [] as string[],
    accessScope: "branch",
    userId,
  },
});

const { value: name } = useField<string | any>("name");
const { value: roleIds } = useField<string[]>("role");
const { value: branchIds } = useField<string[]>("branchIds");
const { value: accessScope } = useField<string>("accessScope");

onMounted(async () => {
  await Promise.all([getUserById(userId), getRolesLookups(), getBranchLookups()]);
  if(userData.value.isActive){
    name.value = userData.value.fullName;
  } else {
    toastService.error(t("roles.userNotActive"));
  }
  await loadEditData();
});

watch(accessScope, (val) => {
  if (val === "global") branchIds.value = [];
});

const loadEditData = async () => {
  if (!isEditMode.value || !roleId) return;
  await getRoleToUserById(userId, roleId);
  if(role.value){
    setValues({
      role: [roleId],
      branchIds: role.value.branchIds || [],
      accessScope: role.value.userAccessScope === 1 ? "global" : "branch",
      userId,
    });
  }
};

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  const payload: AssignRole = {
    userId: values.userId,
    roleId: isEditMode.value && roleId ? roleId : values.role,
    accessScope: values.accessScope === "global" ? 1 : 2,
    ...(values.accessScope === "branch" && { branchIds: values.branchIds }),
  };
  isEditMode.value
    ? await updateAssignRole(payload)
    : await assignRole(payload);
  isSubmitting.value = false;
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="accessControl" subtitle="usersManagement.usersManagement" actionName="roles.assignRole" />
    <card class="bg-white rounded-[10px]">
      <template #title>
        <div class="flex flex-col mb-4 pt-4 px-20">
          <h2 class="heading-title">
            {{ $t("usersManagement.assignRoleToUser") }}
          </h2>
          <p class="subheading-title">
            {{ $t("usersManagement.assignRoleToUserDesc") }}
          </p>
        </div>
      </template>
      <template #content>
        <div class="px-20 mb-6">
          <form class="space-y-5" @submit.prevent="onSubmit">
            <div>
              <label class="text-gray-700 font-bold">
                {{ $t("usersManagement.user") }}
              </label>
              <InputText v-model="name" placeholder="Ex: user name" class="mt-1 w-full p-3 border rounded-lg"
                readonly />
            </div>
            <div>
              <label class="text-gray-700 font-bold">
                {{ $t("roles.roles") }}
              </label>
              <MultiSelect filter :maxSelectedLabels="3" :disabled="isEditMode" v-model="roleIds" :options="rolesLookups" optionLabel="label"
                optionValue="value" class="w-full mt-1" :class="{ 'p-invalid': errors.role }"
                :placeholder="$t('select roles')" />
              <small v-if="errors.role" class="text-danger-500">
                {{ $t(errors.role) }}
              </small>
            </div>
            <div class="flex flex-col gap-4 w-full">
              <label class="text-gray-700 font-bold">
                {{ $t("roles.accessScope") }}
              </label>
              <div class="flex items-center justify-between border rounded-xl px-4 py-4 cursor-pointer" :class="accessScope === 'global'
                ? 'border-primary-400 bg-primary-25'
                : 'border-gray-300'
                " @click="accessScope = 'global'">
                <div class="flex items-center gap-3">
                  <RadioButton inputId="global" name="access" value="global" v-model="accessScope" />
                  <label class="font-medium cursor-pointer">
                    {{ $t("roles.globalAccess") }}
                  </label>
                </div>
              </div>
              <div class="flex items-center justify-between border rounded-xl px-4 py-4 cursor-pointer" :class="accessScope === 'branch'
                ? 'border-primary-400 bg-primary-25'
                : 'border-gray-300'
                " @click="accessScope = 'branch'">
                <div class="flex items-center gap-3">
                  <RadioButton inputId="branch" name="access" value="branch" v-model="accessScope" />
                  <label class="font-medium cursor-pointer">
                    {{ $t("roles.branchSpecific") }}
                  </label>
                </div>
              </div>
              <small v-if="errors.accessScope" class="text-danger-500">
                {{ $t(errors.accessScope) }}
              </small>
            </div>
            <div v-if="accessScope === 'branch'">
              <label class="text-gray-700 font-bold">{{
                $t("roles.assignedBranch")
              }}</label>
              <MultiSelect filter :maxSelectedLabels="3" v-model="branchIds" :options="branchesLookups" optionLabel="label" optionValue="value"
                class="w-full mt-1 rounded-2xl" :class="{ 'p-invalid': errors.branchIds }"
                :placeholder="$t('branch.selectbranches')" />
              <small v-if="errors.branchIds" class="text-danger-500">{{
                $t(errors.branchIds)
              }}</small>
            </div>
            <div class="flex justify-between gap-4 mb-4 container px-20">
              <BaseButton label="cancel" variant="ghost" block :to="{ name: 'UserManagement' }" />
              <BaseButton type="submit" :label="isEditMode ? 'Update' : 'Assign'" variant="primary" block :disabled="isSubmitting"
                :loading="isSubmitting" />
            </div>
          </form>
        </div>
      </template>
    </card>
  </div>
</template>

<style scoped>
:deep(.p-radiobutton .p-radiobutton-box) {
  background: white !important;
  transition: all 0.2s ease-in-out;
  border-color: var(--color-primary-500) !important;
}

:deep(.p-radiobutton .p-radiobutton-box.p-highlight) {
  border-color: var(--color-primary-500) !important;
  background: var(--color-primary-500) !important;
  outline: 3px solid rgba(59, 130, 246, 0.25) !important;
}

:deep(.p-radiobutton .p-radiobutton-box .p-radiobutton-icon) {
  width: 10px;
  height: 10px;
  background: var(--color-primary-500) !important;
  border-radius: 50%;
}
</style>
