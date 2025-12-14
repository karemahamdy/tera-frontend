<script setup lang="ts">
import { ref } from "vue";
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import { useRoute } from "vue-router";
import FileUpload from "@/sharedComponents/FileUpload.vue";

const props = defineProps<{
    mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();
const groupId = ref<string | null>(route.params.id ? String(route.params.id) : null);
const groupName = ref<string>("");
const isAdmin = ref<boolean>(false);
const isActive = ref<boolean>(true)
const options = ref<Array<{ label: string; value: string }>>([
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" },
    { label: "Viewer", value: "viewer" },
]);
const selectedOption = ref<{ label: string; value: string } | null>(null);

const handleSubmit = () => {
    console.log(`form submited ${groupId.value}`);
}
</script>
<template>
    <div>
        <ScreenHeader title="accessControl" subtitle="usersManagement.usersManagement" />
        <card class="p-6 bg-[#ffffff] rounded-[10px]">
            <template #title>
                <div class="flex flex-col pt-4 px-20">
                    <h2 class="heading-title">{{ editMode ? $t("usersManagement.editusersManagement") :
                        $t("usersManagement.addNewUserManagement") }}</h2>
                    <p class="subheading-title">
                        {{ editMode ? $t("usersManagement.updateUserInfo") : $t("usersManagement.addUserInfo") }}
                    </p>
                </div>
            </template>
            <template #content>
                <form @submit.prevent="handleSubmit" class="space-y-6 px-20">
                    <FileUpload />
                    <div class="flex flex-row gap-8">
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("usersManagement.fullName")
                                }}</label>
                            <InputText v-model="groupName" placeholder="Enter full name"
                                class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("usersManagement.username")
                                }}</label>
                            <InputText v-model="groupName" placeholder="Enter Username"
                                class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                    </div>

                    <div class="flex flex-row gap-8">
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("auth.email") }}</label>
                            <InputText v-model="groupName" placeholder="user@company.com"
                                class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("usersManagement.internalID")
                                }}</label>
                            <InputText v-model="groupName" placeholder="Enter user id"
                                class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                    </div>

                    <div class="flex flex-row gap-8">
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("auth.password") }}</label>
                            <InputText v-model="groupName" placeholder="******"
                                class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("auth.confirmPassword") }}</label>
                            <InputText v-model="groupName" placeholder="*****"
                                class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                    </div>

                    <div class="flex flex-row gap-8">
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("usersManagement.department")
                                }}</label>
                            <Dropdown v-model="selectedOption" :options="options" optionLabel="label"
                                :placeholder="$t('select')" class="w-full mt-1" />
                        </div>
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("userGroup.userGroup") }}</label>
                            <Dropdown v-model="selectedOption" :options="options" optionLabel="label"
                                :placeholder="$t('select ')" class="w-full mt-1" />
                        </div>
                    </div>
                    <div class="flex items-start gap-72">
                        <div>
                            <p class="mb-3 font-medium text-gray-700">Account Type</p>

                            <div class="flex flex-start gap-3">
                                <ToggleSwitch v-model="isAdmin" />
                                <span class="text-gray-600">Is Admin</span>
                            </div>
                        </div>
                        <div>
                            <p class="mb-3 font-medium text-gray-700">Account Status</p>

                            <div class="flex flex-start gap-3">
                                <ToggleSwitch v-model="isActive" />
                                <span class="text-gray-600">Active</span>
                            </div>
                        </div>

                    </div>
                    <div class="flex justify-between gap-8 mb-4  w-full">
                        <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'UserManagement' }" />
                        <BaseButton :label="editMode ? 'button.save' : 'usersManagement.addUser'" variant="primary"
                            block />
                    </div>
                </form>
            </template>
        </card>
    </div>
</template>
<style scoped></style>
