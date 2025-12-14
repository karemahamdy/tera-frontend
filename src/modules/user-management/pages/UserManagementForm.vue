<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import FileUpload from "@/sharedComponents/FileUpload.vue";

import FormInput from "@/sharedComponents/FormInput.vue";
import FormDropdown from "@/sharedComponents/FormDropdown.vue";
import ToggleItem from "@/sharedComponents/ToggleItem.vue";

const props = defineProps<{
    mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();

const form = ref({
    id: route.params.id ? String(route.params.id) : null,
    fullName: "",
    username: "",
    email: "",
    internalId: "",
    password: "",
    confirmPassword: "",
    department: null,
    group: null,
    isAdmin: false,
    isActive: true,
});

const options = [
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" },
    { label: "Viewer", value: "viewer" },
];

const handleSubmit = () => {
    console.log("submitted", form.value);
};
</script>

<template>
    <div>
        <ScreenHeader title="accessControl" subtitle="usersManagement.usersManagement" />

        <Card class="p-6 bg-white rounded-[10px]">
            <template #title>
                <div class="flex flex-col pt-4 px-20">
                    <h2 class="heading-title">
                        {{ editMode ? $t("usersManagement.editusersManagement") :
                            $t("usersManagement.addNewUserManagement") }}
                    </h2>
                    <p class="subheading-title">
                        {{ editMode ? $t("usersManagement.updateUserInfo") : $t("usersManagement.addUserInfo") }}
                    </p>
                </div>
            </template>

            <template #content>
                <form @submit.prevent="handleSubmit" class="space-y-6 px-20">
                    <FileUpload />

                    <div class="flex gap-8">
                        <FormInput class="w-1/2" :label="$t('usersManagement.fullName')" v-model="form.fullName" />
                        <FormInput class="w-1/2" :label="$t('usersManagement.username')" v-model="form.username" />
                    </div>

                    <div class="flex gap-8">
                        <FormInput class="w-1/2" :label="$t('auth.email')" v-model="form.email" />
                        <FormInput class="w-1/2" :label="$t('usersManagement.internalID')" v-model="form.internalId" />
                    </div>

                    <div class="flex gap-8">
                        <FormInput class="w-1/2" type="password" :label="$t('auth.password')" v-model="form.password" />
                        <FormInput class="w-1/2" type="password" :label="$t('auth.confirmPassword')"
                            v-model="form.confirmPassword" />
                    </div>

                    <div class="flex gap-8">
                        <FormDropdown class="w-1/2" :label="$t('usersManagement.department')" :options="options"
                            v-model="form.department" />
                        <FormDropdown class="w-1/2" :label="$t('userGroup.userGroup')" :options="options"
                            v-model="form.group" />
                    </div>

                    <div class="flex justify-between">
                        <ToggleItem title="Account Type" label="Is Admin" v-model="form.isAdmin" />
                        <ToggleItem title="Account Status" label="Active" v-model="form.isActive" />
                    </div>
                    
                    <div class="flex gap-8">
                        <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'UserManagement' }" />
                        <BaseButton :label="editMode ? 'button.save' : 'usersManagement.addUser'" variant="primary"
                            block />
                    </div>
                </form>
            </template>
        </Card>
    </div>
</template>
<style scoped>

</style>