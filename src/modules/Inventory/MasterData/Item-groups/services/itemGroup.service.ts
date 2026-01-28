import axiosWrapper from "@/app/http/axiosWrapper";
import type { AddItemGroup, ItemGroupResponse, Pagination } from "../types/itemGroup";

export const itemGroupsService = {
    async getAll(params: Pagination & { level: string }) {
        const queryParams = new URLSearchParams();
        if (params.pageIndex) queryParams.append('pageIndex', params.pageIndex.toString());
        if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.orderBy) queryParams.append('orderBy', params.orderBy);
        if (params.orderDirection) queryParams.append('orderDirection', params.orderDirection);
        
        const resp = await axiosWrapper.get<ItemGroupResponse>(
            `/ItemClassifications/${params.level}/list?${queryParams.toString()}`
        );
        return resp.data;
    },

    async getById(id: string, level: string): Promise<AddItemGroup> {
        const data = await axiosWrapper.get<any>(`/ItemClassifications/${level}/${id}`);
        return data.data;
    },

    async create(payload: AddItemGroup, level: string) {
        const data = await axiosWrapper.post<any>(`/ItemClassifications/${level}`, payload);
        return data.data;
    },

    async update(id: string, payload: AddItemGroup, level: string) {
        const data = await axiosWrapper.put<any>(`/ItemClassifications/${level}/${id}`, payload);
        return data.data;
    },

    async delete(id: string, level: string): Promise<void> {
        await axiosWrapper.delete(`/ItemClassifications/${level}/${id}`);
    },

};
