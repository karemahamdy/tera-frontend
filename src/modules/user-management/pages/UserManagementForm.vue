<script setup lang="ts">
import { useRoute } from "vue-router";
import { useForm } from "vee-validate";
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import FileUpload from "@/sharedComponents/inputs/FileUpload.vue";
import FormInput from "@/sharedComponents/inputs/FormInput.vue";
import FormDropdown from "@/sharedComponents/inputs/FormDropdown.vue";
import ToggleItem from "@/sharedComponents/inputs/ToggleItem.vue";
import { userSchema } from "../validation/UserSchema";

const props = defineProps<{
    mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();

const { handleSubmit, errors, defineField } = useForm({
    validationSchema: userSchema,
    initialValues: {
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
    },
});

const [fullName] = defineField("fullName");
const [username] = defineField("username");
const [email] = defineField("email");
const [internalId] = defineField("internalId");
const [password] = defineField("password");
const [confirmPassword] = defineField("confirmPassword");
const [department] = defineField("department");
const [group] = defineField("group");
const [isAdmin] = defineField("isAdmin");
const [isActive] = defineField("isActive");

const options = [
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" },
    { label: "Viewer", value: "viewer" },
];

const onSubmit = handleSubmit((values) => {
    console.log("User payload ", values);
});
</script>


<template>
    <div>
        <ScreenHeader title="accessControl" subtitle="usersManagement.usersManagement" :actionName="editMode ? $t('usersManagement.editusersManagement') :
            $t('usersManagement.addNewUserManagement')" />

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
                <form @submit.prevent="onSubmit" class="space-y-6 px-20">
                    <FileUpload />

                    <div class="flex gap-8">
                        <FormInput class="w-1/2" :label="$t('usersManagement.fullName')" v-model="fullName"
                            :error="errors.fullName" :placeholder="$t('enterFullName')" />

                        <FormInput class="w-1/2" :label="$t('usersManagement.username')" v-model="username"
                            :error="errors.username" :placeholder="$t('enterUsername')" />
                    </div>

                    <div class="flex gap-8">
                        <FormInput class="w-1/2" :label="$t('auth.email')" v-model="email" :error="errors.email"
                            placeholder="user@company.com" />

                        <FormInput class="w-1/2" :label="$t('usersManagement.internalID')" v-model="internalId"
                            :error="errors.internalId" :placeholder="$t('enterUserID')" />
                    </div>

                    <div class="flex gap-8">
                        <FormInput class="w-1/2" type="password" :label="$t('auth.password')" v-model="password"
                            :error="errors.password" placeholder="****" />

                        <FormInput class="w-1/2" type="password" :label="$t('auth.confirmPassword')"
                            v-model="confirmPassword" :error="errors.confirmPassword" placeholder="****" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <ToggleItem :title="$t('usersManagement.accountType')" label="Is Admin" v-model="isAdmin" />
                        <ToggleItem :title="$t('usersManagement.accountStatus')" label="Active" v-model="isActive" />
                    </div>

                    <div class="flex gap-8">
                        <FormDropdown class="w-1/2" :label="$t('usersManagement.department')" :options="options"
                            v-model="department" :error="errors.department" placeholder="Finance" />

                        <FormDropdown class="w-1/2" :label="$t('userGroup.userGroup')" :options="options"
                            v-model="group" :error="errors.group" placeholder="IT" />
                    </div>

                    <div class="flex gap-8">
                        <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'UserManagement' }" />
                        <BaseButton :label="editMode ? 'button.save' : 'usersManagement.addUser'" variant="primary"
                            block type="submit" />
                    </div>
                </form>

            </template>
        </Card>
    </div>
</template>
<style scoped></style>