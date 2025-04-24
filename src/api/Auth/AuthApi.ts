import {baseApi} from "../Base";
import type {AuthResponseDto} from "../../DTO/AuthResponse.dto";
import type {LoginDto} from "../../DTO/Login.dto";
import type {RegistrationDto} from "../../DTO/Registration.dto";

export const authApi = {
    registration: async (dto: RegistrationDto): Promise<AuthResponseDto> => {
        const response = await baseApi.post("/auth/registration", dto);
        return response.data;
    },

    login: async (dto: LoginDto): Promise<AuthResponseDto> => {
        const response = await baseApi.post("/auth/login", dto);
        return response.data;
    },
};