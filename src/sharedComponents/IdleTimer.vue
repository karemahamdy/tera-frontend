<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import timerIcon from '@/assets/images/timer.png';

import { useUserStore } from '@/app/store/useUserStore';
const userStore = useUserStore();

const IDLE_TIME = 0.5 * 60 * 1000;
let idleTimer: number | null = null;

const showDeleteDialog = ref<boolean>(false);

const IDLE_SECONDS = 1.8 * 60;

const remainingSeconds = ref(IDLE_SECONDS);
let intervalId: number | null = null;

const formattedTime = computed(() => {
    const minutes = Math.floor(remainingSeconds.value / 60);
    const seconds = remainingSeconds.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

const resetIdleTimer = () => {
    if(!showDeleteDialog.value) stopTimer();

    if (idleTimer) {
        clearTimeout(idleTimer);
    }

    idleTimer = window.setTimeout(() => {
        if (!showDeleteDialog.value) {
            showDeleteDialog.value = true;
            startTimer()
        }
    }, IDLE_TIME);
};

const activityEvents = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
];

const startTimer = () => {
    stopTimer();
    remainingSeconds.value = IDLE_SECONDS;

    intervalId = window.setInterval(() => {
        remainingSeconds.value--;

        if (remainingSeconds.value <= 0) {
            logout();
        }
    }, 1000);
};

const stopTimer = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

onMounted(() => {
    resetIdleTimer();

    activityEvents.forEach((event) => {
        window.addEventListener(event, resetIdleTimer);
    });
});

onBeforeUnmount(() => {
    if (idleTimer) {
        clearTimeout(idleTimer);
    }

    activityEvents.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
    });
});

const handleConfirm = () => {
    stopTimer()
    showDeleteDialog.value = false;
}

function logout() {
    stopTimer()
    userStore.logout()
}
</script>

<template>
    <div>
        <StatusDialog :timer="formattedTime" v-model:visible="showDeleteDialog" :icon="timerIcon"
            :title="$t('alert.sessionExpire')" :buttons="[
                { label: $t('alert.logout'), variant: 'ghost', action: 'cancel' },
                { label: $t('alert.stay'), variant: 'primary', action: 'confirm' },
            ]" @confirm="handleConfirm" @cancel="logout" />
    </div>
</template>
