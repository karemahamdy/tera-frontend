<script setup lang="ts">
import { ref } from 'vue';
import ScreenHeader from '@/sharedComponents/ScreenHeader.vue';
import BaseButton from '@/sharedComponents/BaseButton.vue';

const groupName = ref<string>('');
const description = ref<string>('');
</script>
<template>
    <div>
        <ScreenHeader title="Access Control" subtitle="User Groups" />
        <card class="p-6 bg-[#ffffff] rounded-[10px]">
            <template #title>
                <div class="flex flex-col">
                    <h2 class="heading-title">Add New User Group</h2>
                    <p class="subheading-title">User groups help organize users and assign roles collectively.</p>
                </div>
            </template>
            <template #content>
                <form class="space-y-6">
                    <div>
                        <label class="text-gray-700 font-medium mb-2 block">Group Name</label>
                        <InputText v-model="groupName" placeholder="Enter group name"
                            class="mt-1 w-full p-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                        <label class="text-gray-700 font-medium mb-2 block">Description</label>
                        <Textarea v-model="description" placeholder="Enter group description"
                            class="mt-1 w-full p-3 border border-gray-300 rounded-lg" rows="4" />
                    </div>
                    <div class="flex justify-between gap-4 mb-4 w-full">
                        <BaseButton label="cancel" variant="ghost" block />
                        <BaseButton label="Login" variant="primary" block :to="{ name: 'Login' }" />
                    </div>
                </form>

            </template>
        </card>
    </div>
</template>
<style scoped></style>