import { ref, computed } from "vue";

export function useSearch<T extends Record<string, any>>(data: T[]) {
    const searchQuery = ref("");

    const onSearch = (value: string) => {
        searchQuery.value = value;
    };

    const filteredData = computed(() => {
        if (!searchQuery.value) return data;

        const word = searchQuery.value.toLowerCase();

        return data.filter((item) =>
            Object.keys(item).some((key) =>
                String(item[key]).toLowerCase().includes(word)
            )
        );
    });

    return { searchQuery, onSearch, filteredData };
}
