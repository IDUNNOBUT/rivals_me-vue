import {baseApi} from "../Base";
import type {UpdateUserDto, UserDto} from "../../DTO/User.dto";

export const userApi = {
    getUser: async (id?: string): Promise<UserDto> => {
        const response = await baseApi.get(id ? `/users/${id}` : "/users");
        return response.data;
    },

    updateUser: async (dto: UpdateUserDto): Promise<UserDto> => {
        const response = await baseApi.patch(`/users`, dto);
        return response.data;
    },

    deleteUser: async (): Promise<UserDto> => {
        const response = await baseApi.delete(`/users`);
        return response.data;
    },
};
