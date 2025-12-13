import { ref, computed } from "vue";

export function useFilters(data: any[], filtersConfig: any[]) {
    const searchQuery = ref("");
    const filters = ref(filtersConfig.map(f => ({ ...f })));

    const setSearch = (value: string) => {
        searchQuery.value = value;
    };

    const onFilterChange = ({ filter, value }: any) => {
        const idx = filters.value.findIndex(f => f.field === filter.field);
        if (idx !== -1) {
            filters.value[idx].value = value;
        }
    };

    const filteredData = computed(() => {
        let result = [...data];
        if (searchQuery.value) {
            const q = searchQuery.value.toLowerCase();
            result = result.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(q)
                )
            );
        }
        filters.value.forEach(filter => {
            if (filter.value !== null && filter.field) {
                result = result.filter(
                    item => item[filter.field] === filter.value
                );
            }
        });

        return result;
    });

    return {
        searchQuery,
        filters,
        filteredData,
        setSearch,
        onFilterChange,
    };
}
