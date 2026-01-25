import axiosWrapper from "@/app/http/axiosWrapper";
import type { AddItemGroup, ItemGroupResponse, Pagination } from "../types/itemGroup";

export const itemGroupsService = {
    async getAll(params: Pagination) {
        const resp = await axiosWrapper.get<ItemGroupResponse>(
            `/ItemGroups/GetAll?${params}`
        );
        return resp.data;
    },

    async getById(id: string): Promise<AddItemGroup> {
        const data = await axiosWrapper.get<any>(`/ItemGroups/GetById/${id}`);
        return data.data;
    },

    async create(payload: AddItemGroup) {
        const data = await axiosWrapper.post<any>(`/ItemGroups/Create`, payload);
        return data.data;
    },

    async update(id: string, payload: AddItemGroup) {
        const data = await axiosWrapper.put<any>(`/ItemGroups/Update/${id}`, payload);
        return data.data;
    },

    async delete(id: string): Promise<void> {
        await axiosWrapper.delete(`/ItemGroups/Delete/${id}`);
    },

    async toggleActive(id: string, isActive: boolean) {
        const data = await axiosWrapper.put<any>(`/ItemGroups/UpdateStatus/${id}`, {
            isActive
        });
        return data.data;
    },
};
