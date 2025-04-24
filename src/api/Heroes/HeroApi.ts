import {baseApi} from "../Base";
import type {HeroDto} from "../../DTO/Hero.dto";

export const heroApi = {
    getHeroes: async (): Promise<HeroDto[]> => {
        const response = await baseApi.get("/heroes");
        return response.data;
    }
};
