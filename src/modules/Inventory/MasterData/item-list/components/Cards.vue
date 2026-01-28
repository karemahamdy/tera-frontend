<script setup lang="ts">

</script>
<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Total On Hand -->
        <div class="p-4 rounded-[16px] bg-[#F7F9FF] relative overflow-hidden group">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-[10px] bg-[#17E0AC] flex items-center justify-center">
                    <VsxIcon iconName="Box" :size="20" color="#FFFFFF" type="linear" />
                </div>
                <span class="text-[#475467] font-bold text-lg">{{ $t('itemList.cards.totalOnHand') }}</span>
            </div>
            <div>
                <div class="text-[32px] font-bold text-[#101828] mb-1">47</div>
                <div class="text-[#475467] text-md">{{ $t('itemList.cards.allWarehouses') }}</div>
            </div>
            <!-- Sparkline -->
            <div class="absolute bottom-12 right-12 w-20 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="105" height="58" viewBox="0 0 105 58" fill="none">
                    <path
                        d="M104 0.419922C97.5203 14.4199 91.4103 32.2923 78.4051 32.2923C62.5339 32.7214 59.2898 16.8029 45.6823 17.6965C22.6792 17.6965 31.1028 56.4199 4.76837e-06 56.4199"
                        stroke="url(#paint0_linear_3685_13223)" stroke-width="2" />
                    <defs>
                        <linearGradient id="paint0_linear_3685_13223" x1="104" y1="0.419922" x2="16.4814" y2="75.6049"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0.125" stop-color="#00DEA3" stop-opacity="0" />
                            <stop offset="0.488932" stop-color="#00DEA3" />
                            <stop offset="1" stop-color="#00DEA3" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>

        <!-- Available Items -->
        <div class="p-4 rounded-[16px] bg-[#F7F9FF] relative overflow-hidden group">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-[10px] bg-[#7F56D9] flex items-center justify-center">
                    <VsxIcon iconName="TrendUp" :size="20" color="#FFFFFF" type="linear" />
                </div>
                <span class="text-[#475467] font-bold text-sm">{{ $t('itemList.cards.availableItems') }}</span>
            </div>
            <div>
                <div class="text-[32px] font-bold text-[#101828] mb-1">18</div>
                <div class="text-[#475467] text-md">{{ $t('itemList.cards.readyToIssue') }}</div>
            </div>
            <!-- Sparkline -->
            <div class="absolute bottom-12 right-12 w-20 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="105" height="58" viewBox="0 0 105 58" fill="none">
                    <path
                        d="M0.53125 50.6364C29.4084 32.5 26.2699 1 37.7788 1C49.0785 1 48.4507 33.4546 66.0282 33.4546C83.6057 33.4546 80.6761 57 104.531 57"
                        stroke="url(#paint0_linear_3685_13234)" stroke-width="2" />
                    <defs>
                        <linearGradient id="paint0_linear_3685_13234" x1="2.83291" y1="44.9091" x2="90.3521"
                            y2="62.4276" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#783EFD" stop-opacity="0" />
                            <stop offset="0.339843" stop-color="#783EFD" />
                            <stop offset="0.631943" stop-color="#783EFD" />
                            <stop offset="1" stop-color="#783EFD" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>

        <!-- Hold Items -->
        <div class="p-4 rounded-[16px] bg-[#F7F9FF]  relative overflow-hidden group">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-[10px] bg-[#FE8F66] flex items-center justify-center">
                    <VsxIcon iconName="I3DCubeScan" :size="20" color="#FFFFFF" type="linear" />
                </div>
                <span class="text-[#475467] font-bold text-lg">{{ $t('itemList.cards.holdItems') }}</span>
            </div>
            <div>
                <div class="text-[32px] font-bold text-[#101828] mb-1">19</div>
                <div class="text-[#475467] text-md">{{ $t('itemList.cards.holdingItems') }}</div>
            </div>
            <!-- Sparkline -->
            <div class="absolute bottom-12 right-12 w-20 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="107" height="57" viewBox="0 0 107 57" fill="none">
                    <path
                        d="M103.797 3C97.1303 17 83.7344 8.5 71.9026 5.5C53.8978 4 94.5373 49 44.6382 35C23.0325 31.5 35.9988 56 3.9988 56"
                        stroke="url(#paint0_linear_3685_13244)" stroke-width="2" />
                    <defs>
                        <linearGradient id="paint0_linear_3685_13244" x1="103.797" y1="3" x2="20.8018" y2="75.291"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0.125" stop-color="#FE8F66" />
                            <stop offset="0.488932" stop-color="#FE8F66" />
                            <stop offset="1" stop-color="#FE8F66" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>

        <!-- Avg Cost -->
        <div class="p-4 rounded-[16px] bg-[#F7F9FF]  relative overflow-hidden group">
            <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-[10px] bg-[#F23985] flex items-center justify-center">
                    <VsxIcon iconName="DollarSquare" :size="20" color="#FFFFFF" type="linear" />
                </div>
                <span class="text-[#475467] font-bold text-lg">{{ $t('itemList.cards.avgCost') }}</span>
            </div>
            <div>
                <div class="text-[32px] font-bold text-[#101828] mb-1">$470</div>
                <div class="text-[#475467] text-md">{{ $t('itemList.cards.movingAverage') }}</div>
            </div>
            <!-- Sparkline -->
            <div class="absolute bottom-12 right-20 w-20 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="106" height="58" viewBox="0 0 106 58" fill="none">
                    <path
                        d="M104.359 1.01519C97.8797 15.0152 78.8645 39.0156 65.8594 39.0156C49.9881 39.4448 59.4669 0.121578 45.8594 1.01519C22.8562 1.01519 30.3594 45.5156 0.359367 57.0152"
                        stroke="url(#paint0_linear_3685_13256)" stroke-width="2" />
                    <defs>
                        <linearGradient id="paint0_linear_3685_13256" x1="104.359" y1="1" x2="16.8206" y2="76.1819"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0.125" stop-color="#F23985" stop-opacity="0" />
                            <stop offset="0.488932" stop-color="#F23985" />
                            <stop offset="1" stop-color="#F23985" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    </div>
</template>