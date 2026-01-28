import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { itemGroupsService } from "../services/itemGroup.service";
import type { AddItemGroup, ItemGroup } from "../types/itemGroup";
import { FileService } from "@/app/services/file.service";

const loading = ref(false);
const apiItemGroups = ref<ItemGroup[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');
const currentLevel = ref<string>('Category');

const lastError = ref<string | null>(null);
const validationErrors = ref<Record<string, string[]>>({});

export function useItemGroup() {
    const { t } = useI18n();

    const fetchItemGroups = async (page = 1, level?: string) => {
        loading.value = true;
        lastError.value = null;
        let levelToUse = level || currentLevel.value;
        if (typeof levelToUse === 'number') {
            const levelMap: Record<number, string> = { 1: 'Category', 2: 'Group1', 3: 'Group2', 4: 'Group3', 5: 'Group4' };
            levelToUse = levelMap[levelToUse] || 'Category';
        }
        currentLevel.value = levelToUse;

        try {
            const response: any = await itemGroupsService.getAll({
                pageIndex: page,
                pageSize: pageSize.value,
                search: searchTerm.value,
                level: levelToUse,
                orderBy: orderBy.value,
                orderDirection: orderDirection.value
            });
            const payload = response && response.data ? response.data : response;
            apiItemGroups.value = payload.items ?? [];
            pageIndex.value = payload.pageIndex ?? page;
            pageSize.value = payload.pageSize ?? pageSize.value;
            totalCount.value = payload.totalCount ?? 0;
            totalPages.value = payload.totalPages ?? 1;
        } catch (err: any) {
            toastService.error(err);
        } finally {
            loading.value = false;
        }
    };

    const createItemGroup = async (payload: AddItemGroup) => {
        loading.value = true;
        validationErrors.value = {};
        try {
            const response = await itemGroupsService.create(payload, currentLevel.value.toString());
            toastService.success(t("itemGroup.createdSuccessfully"));
            await fetchItemGroups(pageIndex.value);
            return response;
        } catch (err: any) {
            const errors = err?.response?.data?.errors || err?.response?.data?.validationErrors;
            if (errors && typeof errors === 'object') {
                validationErrors.value = errors;
            }
            toastService.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const updateItemGroup = async (id: string, payload: AddItemGroup) => {
        loading.value = true;
        validationErrors.value = {};
        try {
            const response = await itemGroupsService.update(id, payload, currentLevel.value.toString());
            toastService.success(t("itemGroup.updatedSuccessfully"));
            await fetchItemGroups(pageIndex.value);
            return response;
        } catch (err: any) {
            const errors = err?.response?.data?.errors || err?.response?.data?.validationErrors;
            if (errors && typeof errors === 'object') {
                validationErrors.value = errors;
            }
            toastService.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const deleteItemGroup = async (id: string) => {
        loading.value = true;
        try {
            await itemGroupsService.delete(id, currentLevel.value.toString());
            toastService.success(t("itemGroup.deletedSuccessfully"));
            await fetchItemGroups(pageIndex.value);
        } catch (err: any) {
            toastService.error(err);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    const importItemGroup = async (file: File) => {
      try {
        await FileService.uploadFile(
          `/ItemClassifications/import/${currentLevel.value}`,
          {
            file: file,
          },
          "itemGroupFile"
        );
        toastService.success(t("itemGroup.itemGroupImportedSuccessfully"));
        fetchItemGroups(pageIndex.value);
      } catch (error) {
        toastService.error(error as string);
      }
    };
  

    const onSearch = (term: string) => {
        searchTerm.value = term;
        fetchItemGroups(1);
    };

    const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
        orderBy.value = orderByField;
        orderDirection.value = direction;
        fetchItemGroups(1);
    };

    const clearErrors = () => {
        validationErrors.value = {};
        lastError.value = null;
    };

    return {
        loading,
        apiItemGroups,
        tableData,
        fetchItemGroups,
        createItemGroup,
        updateItemGroup,
        deleteItemGroup,
        importItemGroup,
        pageIndex,
        pageSize,
        totalCount,
        totalPages,
        setPage: (p: number) => fetchItemGroups(p),
        lastError,
        validationErrors,
        clearErrors,
        onSearch,
        onSort
    };
}
