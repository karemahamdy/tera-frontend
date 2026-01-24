
import type { App } from 'vue';
import FormInput from '@/sharedComponents/inputs/FormInput.vue';
import ScreenHeader from '@/sharedComponents/ScreenHeader.vue';
import BaseButton from '@/sharedComponents/BaseButton.vue';
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import FormDropdown from "@/sharedComponents/inputs/FormDropdown.vue";
import ToggleItem from "@/sharedComponents/inputs/ToggleItem.vue";

export function GlobalComponents(app: App) {
    app.component('FormInput', FormInput);
    app.component('ScreenHeader', ScreenHeader);
    app.component('BaseButton', BaseButton);
    app.component('PageHeader', PageHeader);
    app.component('DynamicTable', DynamicTable);
    app.component('StatusDialog', StatusDialog);
    app.component('FormDropdown', FormDropdown);
    app.component('ToggleItem', ToggleItem);
  
  }
