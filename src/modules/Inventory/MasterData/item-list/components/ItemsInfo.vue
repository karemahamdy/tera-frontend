<script setup lang="ts">
import { computed } from 'vue';
import StatusCard from '../../../../../sharedComponents/StatusCard.vue';


const cards = computed(() => {

    return [
        {
            variant: 'blue',
            icon: 'Chart21',
            title: 'Total Items',
            value: '1,245',

        },
        {
            variant: 'green',
            icon: 'Verify',
            title: 'Active Items',
            value: '647',
        },
        {
            variant: 'orange',
            icon: 'BoxTime',
            title: 'Minimum Stock',
            value: '24',
        },
        {
            variant: 'pink',
            icon: 'TransmitSquare',
            title: 'Total Items',
            value: '1,245',

        },
    ];
});
</script>

<template>
    <div class="grid gap-6 md:grid-cols-4 sm:grid-cols-1 my-4">
        <StatusCard v-for="(card, index) in cards" :key="index" v-bind="card" />
    </div>
</template>
