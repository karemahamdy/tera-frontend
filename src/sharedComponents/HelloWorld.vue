<script setup lang="ts">
import BaseButton from './BaseButton.vue';
// import TailwindCard from "./TailwindCard.vue";
function deleteUser() {
  console.log("User deleted");
} 
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
