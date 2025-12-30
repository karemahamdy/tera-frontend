<script setup lang="ts">
import { ref } from "vue";

const isOpen = ref(false);
const hasNotification = ref(true);

const notifications = ref([
  { id: 1, message: "New user registered" },
  { id: 2, message: "Server backup completed" },
  { id: 3, message: "New message from John" },
]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    hasNotification.value = false;
  }
};
</script>

<template>
  <div class="relative">
    
    <button
      @click="toggleDropdown"
      class="p-2 text-gray-500 cursor-pointer bg-[#FAFBFB] rounded-full relative"
    >
      <VsxIcon iconName="Notification" :size="24" type="linear" />
    
      <span
        v-if="hasNotification"
        class="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FC9D0F] rounded-full"
      ></span>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      <div class="p-4 font-semibold border-b border-gray-100 text-gray-800">Notifications</div>

      <div v-if="notifications.length > 0" class="max-h-64 overflow-y-auto">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
        >
          {{ notification.message }}
        </div>
      </div>

      <div v-else class="p-4 text-gray-400 text-sm">
        No new notifications
      </div>
    </div>
  </div>
</template>


