<script setup lang="ts">
import { ref } from "vue";
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import { useRoute } from "vue-router";

const props = defineProps<{
    mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();
const groupId = ref<string | null>(route.params.id ? String(route.params.id) : null);
const groupName = ref<string>("");
const description = ref<string>("");

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
                        {{ editMode ? $t("usersManagement.updateUserInfo") : $t("usersManagement.addUserInfo")  }}
                    </p>
                </div>
            </template>
            <template #content>
                <form @submit.prevent="handleSubmit" class="space-y-6 px-20">  
                    <div class="flex flex-row gap-8">
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("usersManagement.fullName") }}</label>
                            <InputText v-model="groupName" placeholder="e.g., Finance Team"
                            class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                   <div class="w-[50%]">
                       <label class="text-gray-700 font-medium mb-2 block">{{ $t("usersManagement.username") }}</label>
                       <InputText v-model="groupName" placeholder="e.g., Finance Team"
                       class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                    </div>
                    </div>
                 
                      <div class="flex flex-row gap-8">
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("auth.email") }}</label>
                            <InputText v-model="groupName" placeholder="e.g., Finance Team"
                            class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                   <div class="w-[50%]">
                       <label class="text-gray-700 font-medium mb-2 block">{{ $t("usersManagement.internalID") }}</label>
                       <InputText v-model="groupName" placeholder="e.g., Finance Team"
                       class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                    </div>
                    </div>
                 
                      <div class="flex flex-row gap-8">
                        <div class="w-[50%]">
                            <label class="text-gray-700 font-medium mb-2 block">{{ $t("auth.password") }}</label>
                            <InputText v-model="groupName" placeholder="e.g., Finance Team"
                            class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                        </div>
                   <div class="w-[50%]">
                       <label class="text-gray-700 font-medium mb-2 block">{{ $t("auth.confirmPassword") }}</label>
                       <InputText v-model="groupName" placeholder="e.g., Finance Team"
                       class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                    </div>
                    </div>
                 
                    
                    <div class="flex justify-between gap-8 mb-4  w-full">
                        <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'userManagement' }" />
                        <BaseButton :label="editMode ? 'button.save' : 'usersManagement.addUser'" variant="primary"
                            block />
                    </div>
                </form>
            </template>
        </card>
    </div>
</template>
<style scoped></style>
