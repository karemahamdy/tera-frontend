<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from './BaseButton.vue';
import StatusDialog from './StatusDialog.vue';
import ChangePassword from './ChangePassword.vue';
import ScreenHeader from './ScreenHeader.vue';
// import TailwindCard from "./TailwindCard.vue";

// Import icons
import downloadIcon from '@/assets/images/download.png';
import dangerIcon from '@/assets/images/danger.png';
import successIcon from '@/assets/images/success.png';
import alertIcon from '@/assets/images/alert.png';
import timerIcon from '@/assets/images/timer.png';
import TableList from './tableList.vue';


// Dialog visibility states
const successDialog = ref(false);
const dangerDialog = ref(false);
const deleteDialog = ref(false);
const downloadDialog = ref(false);
const logoutDialog = ref(false);

// Loading states
const isDownloading = ref(false);

// Show dialog functions
const showSuccess = () => {
    successDialog.value = true;
    // Auto redirect after 3 seconds
    setTimeout(() => {
        successDialog.value = false;
        console.log('Redirecting...');
    }, 3000);
};

const showDanger = () => {
    dangerDialog.value = true;
    // Auto close after 3 seconds
    setTimeout(() => {
        dangerDialog.value = false;
    }, 3000);
};

const showDelete = () => {
    deleteDialog.value = true;
};
const showLogout = () => {
    logoutDialog.value = true;
};

const showDownload = () => {
    downloadDialog.value = true;
};

// Handle actions
const handleDeleteConfirm = () => {
    console.log('Deleting user...');
    // Add your delete logic here
    deleteDialog.value = false;
};

const handleDownloadConfirm = () => {
    console.log('Downloading template...');
    isDownloading.value = true;
    
    // Simulate download
    setTimeout(() => {
        isDownloading.value = false;
        downloadDialog.value = false;
        console.log('Download complete!');
    }, 2000);
};
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <h1 class="heading-title"> HEADING TITLE </h1>
    <h6 class="subheading-title">SUBHEADING TITLE</h6>

<ScreenHeader title="Access Control" subtitle="Roles & Permissions" />

    <div class="flex justify-between gap-4 mb-4 container px-32">
      <BaseButton label="cancel" variant="ghost" block/>
      <BaseButton label="Login" variant="primary" block  :to="{ name: 'Login' }"/>

    </div>

    <div class="flex  gap-4 mb-4 container">
      <BaseButton label="Export" variant="outline-primary" icon="pi pi-file-export"/>
      <BaseButton label="Add User" variant="primary" icon="pi pi-plus" />
      <BaseButton label="Yes, Delete" variant="danger" :onClick="deleteUser" />
      <BaseButton label="cancel" variant="ghost" />
    </div>

     <h2 class="text-2xl font-bold mb-4 bg-primary-500">Status Dialog Examples</h2>
    
    <div class="flex gap-2 mb-2">
     
            <Button label="Success Dialog" @click="showSuccess" severity="success" />
            <Button label="Danger Dialog" @click="showDanger" severity="danger" />
            <Button label="Alert Dialog" @click="showDelete" severity="warn" />
            <Button label="Download Dialog" @click="showDownload" />
            <Button label="logout Dialog" @click="showLogout" />

        </div>

        <!-- Success Dialog -->
        <StatusDialog
            v-model:visible="successDialog"
            :icon="successIcon"
            title="User Created Successfully"
            description="New user account has been added. Please wait… you will be redirected shortly."
            :showSpinner="true"
        />

        <!-- Danger Dialog -->
        <StatusDialog
            v-model:visible="dangerDialog"
            :icon="dangerIcon"
            title="Validation failed. Please check and try again!"
            :showSpinner="true"
        />

        <!-- Delete Dialog -->
        <StatusDialog
            v-model:visible="deleteDialog"
            :icon="alertIcon"
            title="Are you sure you want to delete this user?"
            :buttons="[
                { label: 'Cancel', variant: 'ghost', action: 'cancel' ,},
                { label: 'Yes, Delete', variant: 'danger', action: 'confirm' }
            ]"
            @confirm="handleDeleteConfirm"
        />

         <StatusDialog
            v-model:visible="logoutDialog"
            :icon="timerIcon"
            title="Your session will expire in"
            timer="05:00 minutes"
            :buttons="[
                { label: 'Stay Logged in ', variant: 'ghost', action: 'cancel' },
                { label: 'Log out now', variant: 'primary', action: 'confirm' }
            ]"
            @confirm="handleDeleteConfirm"
        />
        
        <!-- Download Dialog -->
        <StatusDialog
            v-model:visible="downloadDialog"
            :icon="downloadIcon"
            title="Download Template"
            description="You are about to download the Excel template (.xlsx) for bulk user uploads."
            :loading="isDownloading"
            :buttons="[
                { label: 'Cancel', variant: 'ghost', action: 'cancel', block: true },
                { label: 'Download', variant: 'primary', action: 'confirm', block: true }
            ]"
            @confirm="handleDownloadConfirm"
        />
    
        <ChangePassword/>
    
     <h2 class="text-2xl font-bold my-4 bg-primary-500"> Entity Page Examples</h2>
<TableList/>

    <Card style="width: 25rem; overflow: hidden">
      <template #header>
        <img alt="user header"
          src="https://shorthand.com/the-craft/types-of-image-file-formats/assets/UPhtO6IIvn/sh-unsplash_4qgbmezb56c-4096x2731.jpeg" />
      </template>
      <template #title>Advanced Card</template>
      <template #subtitle>Card subtitle</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore
          sed consequuntur error repudiandae numquam deserunt quisquam repellat
          libero asperiores earum nam nobis, culpa ratione quam perferendis
          esse, cupiditate neque quas!
        </p>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <Button label="Cancel" severity="secondary" variant="outlined" class="w-full" />
          <Button label="Save" class="w-full" />
        </div>
      </template>
    </Card>
    <!-- <TailwindCard class="mt-10 rounded" /> -->
  </div>
</template>

<style>
body {
  font-family: "Arial", sans-serif;
}
</style>
