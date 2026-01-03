<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import { useField, useForm  } from "vee-validate";
import { assignRolesSchema } from "../validation/AssignRolesSchema";
import { useGroupRoles } from "../composables/assignRolesToGroup";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { useLookups } from "@/composables/useLookups";

const { createRoleGroup  } = useGroupRoles() ;
const { fetchLookups, roles, branches } = useLookups();
const route = useRoute();

const { handleSubmit, errors } = useForm({
  validationSchema: assignRolesSchema,
  initialValues: {
    name: "",
    role: [] as string[],
    roles: [] as string[],
    accessScope: "branch",
    groupId: route.params.id as string
  },
});

onMounted(fetchLookups);

const { value: roleIds } = useField<string[]>("role");
const { value: branchIds } = useField<string[]>("roles");
const { value: accessScope } = useField<string>("accessScope");
const { value: name } = useField<string>("name");
const router = useRouter();

const onSubmit = handleSubmit(async (values) => {
  alert("SUBMITTED");
  await createRoleGroup({
    groupId: values.groupId,
    roleId: values.role,           
    branchIds: values.roles,       
    accessScope: values.accessScope === "global" ?  "1": "2"
  });
console.log("test");
console.log(values);
  router.push({ name: "UserGroup" });
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

              <InputText v-model="name" placeholder="Finance Team" class="mt-1 w-full p-3 border rounded-lg"
                :class="{ 'border-danger-500': errors.name }" />

              <small v-if="errors.name" class="text-danger-500">
                {{ errors.name }}
              </small>
            </div>
            <div>
              <label class="text-gray-700 font-bold">
                {{ $t("roles.roleName") }}
              </label>

              <MultiSelect v-model="roleIds" :options="roles" optionLabel="name" optionValue="id"
                class="w-full mt-1" :placeholder="$t('select roles')" />
            </div>
            <div class="flex flex-col gap-4 w-full">
              <label class="text-gray-700 font-bold">
                {{ $t("roles.accessScope") }}
              </label>

              <div class="flex items-center justify-between border rounded-xl px-4 py-4 cursor-pointer" :class="accessScope === 'global'
                ? 'border-primary-400 bg-primary-25'
                : 'border-gray-300'" @click="accessScope = 'global'">
                <div class="flex items-center gap-3">
                  <RadioButton inputId="global" name="access" value="global" v-model="accessScope" />
                  <label class="font-medium cursor-pointer">
                    {{ $t("roles.globalAccess") }}
                  </label>
                </div>
              </div>

              <div class="flex items-center justify-between border rounded-xl px-4 py-4 cursor-pointer" :class="accessScope === 'branch'
                ? 'border-primary-400 bg-primary-25'
                : 'border-gray-300'" @click="accessScope = 'branch'">
                <div class="flex items-center gap-3">
                  <RadioButton inputId="branch" name="access" value="branch" v-model="accessScope" />
                  <label class="font-medium cursor-pointer">
                    {{ $t("roles.branchSpecific") }}
                  </label>
                </div>
              </div>

              <small v-if="errors.accessScope" class="text-danger-500">
                {{ errors.accessScope }}
              </small>
            </div>
            <div>
              <label class="text-gray-700 font-bold">
                {{ $t("roles.branches") }}
              </label>

              <MultiSelect v-model="branchIds" :options="branches" optionLabel="name" optionValue="id"
                class="w-full mt-1 rounded-2xl" 
                :placeholder="$t('branch.selectbranches')" />

            </div>
             <div class="flex justify-between gap-4 mb-4 container px-20">
          <BaseButton label="cancel" variant="ghost" block :to="{ name: 'UserGroup' }" />
          <BaseButton label="Assign" variant="primary" block type="submit" />
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