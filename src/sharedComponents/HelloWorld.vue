<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from './BaseButton.vue';
import StatusDialog from './StatusDialog.vue';
// import TailwindCard from "./TailwindCard.vue";

const successDialog = ref(false);
const dangerDialog = ref(false);
const deleteDialog = ref(false);
const downloadDialog = ref(false);
const isDownloading = ref(false);

function deleteUser() {
  console.log("User deleted");
} 
const showSuccess = () => {
  successDialog.value = true;
};

const showDanger = () => {
  dangerDialog.value = true;
};

const showDelete = () => {
  deleteDialog.value = true;
};

const showDownload = () => {
  downloadDialog.value = true;
  isDownloading.value = true;

  
};

const handleConfirm = () => {
  console.log('Confirmed');
};

const handleCancel = () => {
  console.log('Cancelled');
};

const handleDelete = () => {
  console.log('Item deleted');
  deleteDialog.value = false;
};
</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <h1 class="heading-title"> HEADING TITLE </h1>
    <h6 class="subheading-title">SUBHEADING TITLE</h6>

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
      <Button label="Deleted Dialog" @click="showDanger" severity="danger" />
      <Button label="alert Dialog" @click="showDelete" severity="warn" />
      <Button label="Download Dialog" @click="showDownload" />
    </div>

    <StatusDialog
      v-model:visible="successDialog"
      status="success"
      title=" User Created Successfully"
      description="New user account has been added. Please wait… you will be redirected shortly."
      :loading="isDownloading"
      
    />

    <StatusDialog
      v-model:visible="dangerDialog"
      status="danger"
      title="Validation failed. Please check and try again.!"    
    />

    <StatusDialog
      v-model:visible="deleteDialog"
      status="delete"
      title="Are you sure you want to delete this user ?"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <StatusDialog
      v-model:visible="downloadDialog"
      status="download"
      title="Download Template"
      description="You are about to download the Excel template (.xlsx) for bulk user uploads."
      
    />

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
