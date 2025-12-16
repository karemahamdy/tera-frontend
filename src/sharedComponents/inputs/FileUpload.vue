<script setup lang="ts">
import { ref } from 'vue';

interface FileData {
    name: string;
    size: number;
    type: string;
}

const fileInputRef = ref < HTMLInputElement | null > (null);
const selectedFile = ref < FileData | null > (null);
const dragActive = ref(false);
const imagePreview = ref < string | null > (null);

const triggerFileInput = () => {
    fileInputRef.value?.click();
};

const handleDragEnter = () => {
    dragActive.value = true;
};

const handleDragLeave = () => {
    dragActive.value = false;
};

const handleDragOver = () => {
    dragActive.value = true;
};

const showImagePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.value = null;
    }
};

const handleDrop = (e: DragEvent) => {
    dragActive.value = false;

    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        selectedFile.value = {
            name: file.name,
            size: file.size,
            type: file.type
        };
        showImagePreview(file);
    }
};

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        selectedFile.value = {
            name: file.name,
            size: file.size,
            type: file.type
        };
        showImagePreview(file);
    }
};
</script>

<template>
    <div class="bg-white flex items-start justify-start">
        <div class="w-full max-w-2xl">
            <div class="flex items-start gap-6">
                <!-- Upload Icon Area -->
                <div :class="[
                    'relative flex-shrink-0 w-48 h-48 rounded-3xl flex items-center justify-center transition-colors cursor-pointer overflow-hidden',
                    dragActive ? 'bg-gray-200' : 'bg-gray-100'
                ]" @dragenter.prevent="handleDragEnter" @dragleave.prevent="handleDragLeave"
                    @dragover.prevent="handleDragOver" @drop.prevent="handleDrop" @click="triggerFileInput">
                    <input ref="fileInputRef" type="file" class="hidden" @change="handleFileChange"
                        accept=".gpag,.png,.pdf" />

                    <!-- Image Preview (shows on top when available) -->
                    <img v-if="imagePreview" :src="imagePreview" alt="Preview"
                        class="absolute inset-0 w-full h-full object-cover" />

                    <div v-else class="relative">
                        <!-- Image Icon -->
                        <div class="w-20 h-20 flex items-center justify-center">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                                <rect x="8" y="12" width="48" height="40" rx="6" stroke="#9CA3AF" stroke-width="2.5"
                                    fill="none" />
                                <circle cx="22" cy="26" r="5" stroke="#9CA3AF" stroke-width="2.5" fill="none" />
                                <path
                                    d="M12 42 L24 30 L32 38 L42 28 L52 38 L52 46 C52 48.2 50.2 50 48 50 L16 50 C13.8 50 12 48.2 12 46 Z"
                                    fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2" />
                            </svg>
                        </div>

                        <!-- Plus Icon Badge -->
                        <div
                            class="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-gray-300">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#4B5563"
                                stroke-width="2.5">
                                <line x1="8" y1="3" x2="8" y2="13" />
                                <line x1="3" y1="8" x2="13" y2="8" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Text Content -->
                <div class="flex-1 pt-4">
                    <div class="flex items-center gap-3 mb-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <h3 class="text-xl font-medium text-gray-900">Upload Image</h3>
                    </div>

                    <div class="relative">
                        <p class="text-gray-400 text-base leading-relaxed">
                            GPAG/PNG/PDF Files should be uploded > the file must be hight in resolution and original in
                            design
                        </p>

                        <!-- Red Dot -->
                        <div class="absolute -right-8 top-2 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>

                    <div v-if="selectedFile" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p class="text-sm text-green-700">
                            Selected: {{ selectedFile.name }}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
