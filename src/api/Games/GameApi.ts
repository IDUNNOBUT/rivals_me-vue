import {baseApi} from "../Base";
import type {CreateGameDto, GameDto, GameFilterDto, UpdateGameDto} from "../../DTO/Game.dto";
import type {PaginationResponseDto} from "../../DTO/Pagination.dto";
import type {PaginationDto} from "../../DTO/Pagination.dto";
import type {HeroTopDto} from "../../DTO/TopList.dto";

export const gameApi = {
    getGames: async (filter: GameFilterDto, pagination?: PaginationDto): Promise<PaginationResponseDto<GameDto[]>> => {
        const response = await baseApi.get("/games", {params: {...filter, ...pagination}});
        return response.data;
    },

    createGame: async (dto: CreateGameDto): Promise<GameDto> => {
        const response = await baseApi.post("/games", dto);
        return response.data;
    },

    updateGame: async (id: string, dto: UpdateGameDto): Promise<GameDto> => {
        const response = await baseApi.patch(`/games/${id}`, dto);
        return response.data;
    },

    deleteGame: async (id: string): Promise<GameDto> => {
        const response = await baseApi.delete(`/games/${id}`);
        return response.data;
    },

    getHeroTop: async (): Promise<HeroTopDto[]> => {
        const response = await baseApi.get("/games/top");
        return response.data;
    },

    getUserStats: async (id?: string): Promise<{ labels: string[], data: number[] }> => {
        const response = await baseApi.get("/games/stat", {params: {id}});
        return response.data;
    },

    getUserOverall: async (id?: string): Promise<{ totalGames: number, winRate: number }> => {
        const response = await baseApi.get("/games/overall", {params: {id}});
        return response.data;
    }
};
