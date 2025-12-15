<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import { ref } from "vue";

const accessScope = ref<string>("branch");
const name = ref<string>("");
const options = ref<Array<{ label: string; value: string }>>([
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
]);
const selectedOption = ref<{ label: string; value: string } | null>(null);
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="accessControl" subtitle="usersManagement.usersManagement" actionName="Assign role" />
    <card class="bg-[#ffffff] rounded-[10px]">
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
          <form class="space-y-5">
            <div>
              <label class="text-gray-700 font-bold">{{
                $t("usersManagement.user")
              }}</label>
              <InputText v-model="name" autocomplete="username" placeholder=""
                class="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                style="background-color: var(--color-gray-100)" />
            </div>
            <div>
              <label class="text-gray-700 font-bold">{{
                $t("roles.roleName")
              }}</label>

              <Dropdown v-model="selectedOption" :options="options" optionLabel="label"
                :placeholder="$t('select roles')" class="w-full mt-1" />
            </div>

            <div class="flex flex-col gap-4 w-full">
              <!-- Global Access -->
              <label class="text-gray-700 font-bold">{{
                $t("roles.accessScope")
              }}</label>
              <div
                class="flex items-center justify-between border rounded-xl px-4 py-4 cursor-pointer hover:border-primary-300 transition"
                :class="accessScope === 'global'
                    ? 'border-primary-400 bg-primary-25'
                    : 'border-gray-300'
                  " @click="accessScope = 'global'">
                <div class="flex items-center gap-3">
                  <RadioButton inputId="global" name="access" value="global" v-model="accessScope" />
                  <div class="flex flex-col">
                    <label class="font-medium text-gray-800 cursor-pointer">{{ $t("roles.globalAccess") }}</label>

                  </div>
                </div>
              </div>

              <!-- Branch-Specific -->
              <div
                class="flex items-center justify-between border rounded-xl px-4 py-4 cursor-pointer hover:border-primary-300 transition"
                :class="accessScope === 'branch'
                    ? 'border-primary-400 bg-primary-25'
                    : 'border-gray-300'
                  " @click="accessScope = 'branch'">
                <div class="flex items-center gap-3">
                  <RadioButton inputId="branch" name="access" value="branch" v-model="accessScope" />
                  <div class="flex flex-col">
                    <label class="font-medium text-gray-800 cursor-pointer">{{ $t("roles.branchSpecific") }}</label>

                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="text-gray-700 font-bold"> {{$t("roles.roles")}}</label>
              <Dropdown v-model="selectedOption" :options="options" optionLabel="label"
                :placeholder="$t('select roles')" class="w-full mt-1" />
            </div>
          </form>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between gap-4 mb-4 container px-20">
          <BaseButton label="cancel" variant="ghost" block :to="{ name: 'UserManagement' }" />
          <BaseButton label="Assign" variant="primary" block />
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
