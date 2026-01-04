<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useForm, useField } from "vee-validate";
import { assignRolesSchema } from "../validation/AssignRolesSchema";
import { useGroupRoles } from "../composables/assignRolesToGroup";
import { useLookups } from "@/composables/useLookups";

const route = useRoute();
const groupId = route.params.id as string;
const roleId = route.params.roleId as string | undefined;
const isSubmitting = ref(false);
const isEditMode = computed(() => !!roleId);

const { getRoleToGroupById, createRoleGroup, updateRoleGroup } = useGroupRoles();
const { getGroupLookups, getRolesLookups, getBranchLookups, groupsLookups, rolesLookups, branchesLookups } = useLookups();

const { handleSubmit, setValues, errors } = useForm({
  validationSchema: assignRolesSchema,
  initialValues: {
    name: "",
    role: [] as string[],
    roles: [] as string[],
    groupAccessScope: "branch",
    groupId,
  },
});

const { value: name } = useField<string>("name");
const { value: roleIds } = useField<string[]>("role");
const { value: branchIds } = useField<string[]>("roles");
const { value: groupAccessScope } = useField<string>("groupAccessScope");

onMounted(async () => {
  await Promise.all([
    getGroupLookups(),
    getRolesLookups(),
    getBranchLookups(),
  ]);

  name.value = currentGroupName.value;
  await loadEditData();
});

const currentGroupName = computed(() =>
  groupsLookups.value.find((group: any) => group.value === groupId)?.label || ""
);

watch(groupAccessScope, (val) => {
  if (val === "global") branchIds.value = [];
});

const loadEditData = async () => {
  if (!isEditMode.value || !roleId) return;

  const roleData = await getRoleToGroupById(groupId, roleId) as { roleId: string; branchIds: string[]; groupAccessScope: number } | null;
  if (!roleData) return;

  setValues({
    name: currentGroupName.value,
    role: [roleData.roleId],
    roles: roleData.branchIds || [],
    groupAccessScope: roleData.groupAccessScope === 1 ? "global" : "branch",
    groupId,
  });
};

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  const payload: any = {
    groupId: values.groupId,
    roleId: isEditMode.value ? roleId : values.role,
    groupAccessScope: values.groupAccessScope === "global" ? 1 : 2,
    ...(values.groupAccessScope === "branch" && { branchIds: values.roles }),
  };
  isEditMode.value
    ? await updateRoleGroup(payload)
    : await createRoleGroup(payload);
  isSubmitting.value = false;
});
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="accessControl" subtitle="userGroup.userGroup" actionName="roles.assignRole" />
    <card class="bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col mb-4 pt-4 px-20">
          <h2 class="heading-title">{{ $t('userGroup.AssignRolesToUserGroup') }}</h2>
          <p class="subheading-title">{{ $t('userGroup.AddRolesGroupDesc') }}</p>
        </div>
      </template>
      <template #content>
        <div class="px-20 mb-6">
          <form class="space-y-5" @submit.prevent="onSubmit">
            <div>
              <label class="text-gray-700 font-bold">
                {{ $t("userGroup.userGroup") }}
              </label>
              <InputText v-model="name" placeholder="Finance Team" class="mt-1 w-full p-3 border rounded-lg" disabled
                :class="{ 'border-danger-500': errors.name }" />
              <small v-if="errors.name" class="text-danger-500">
                {{ errors.name }}
              </small>
            </div>
            <div>
              <label class="text-gray-700 font-bold">
                {{ $t("roles.roleName") }}
              </label>
              <MultiSelect v-model="roleIds" :options="rolesLookups" optionLabel="label" optionValue="value"
                class="w-full mt-1" :class="{ 'p-invalid': errors.role }" :placeholder="$t('select roles')" />
              <small v-if="errors.role" class="text-danger-500">
                {{ errors.role }}
              </small>
            </div>
            <div class="flex flex-col gap-4 w-full">
              <label class="text-gray-700 font-bold">
                {{ $t("roles.accessScope") }}
              </label>
              <div class="flex items-center justify-between border rounded-xl px-4 py-4 cursor-pointer" :class="groupAccessScope === 'global'
                ? 'border-primary-400 bg-primary-25'
                : 'border-gray-300'" @click="groupAccessScope = 'global'">
                <div class="flex items-center gap-3">
                  <RadioButton inputId="global" name="access" value="global" v-model="groupAccessScope" />
                  <label class="font-medium cursor-pointer">
                    {{ $t("roles.globalAccess") }}
                  </label>
                </div>
              </div>
              <div class="flex items-center justify-between border rounded-xl px-4 py-4 cursor-pointer" :class="groupAccessScope === 'branch'
                ? 'border-primary-400 bg-primary-25'
                : 'border-gray-300'" @click="groupAccessScope = 'branch'">
                <div class="flex items-center gap-3">
                  <RadioButton inputId="branch" name="access" value="branch" v-model="groupAccessScope" />
                  <label class="font-medium cursor-pointer">
                    {{ $t("roles.branchSpecific") }}
                  </label>
                </div>
              </div>
              <small v-if="errors.groupAccessScope" class="text-danger-500">
                {{ errors.groupAccessScope }}
              </small>
            </div>
            <div v-if="groupAccessScope === 'branch'">
              <label class="text-gray-700 font-bold">{{ $t("roles.branches") }}</label>
              <MultiSelect v-model="branchIds" :options="branchesLookups" optionLabel="label" optionValue="value"
                class="w-full mt-1 rounded-2xl" :class="{ 'p-invalid': errors.roles }"
                :placeholder="$t('branch.selectbranches')" />
              <small v-if="errors.roles" class="text-danger-500">{{ errors.roles }}</small>
            </div>
            <div class="flex justify-between gap-4 mb-4 container px-20">
              <BaseButton label="cancel" variant="ghost" block :to="{ name: 'UserGroup' }" />
              <BaseButton :label="isEditMode ? 'Update' : 'Assign'" variant="primary" block :disabled="isSubmitting"
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