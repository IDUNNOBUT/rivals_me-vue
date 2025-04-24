import {baseApi} from "../Base";
import type {MapDto} from "../../DTO/Map.dto";

export const mapApi = {
    getMaps: async (): Promise<MapDto[]> => {
        const response = await baseApi.get("/maps");
        return response.data;
    }
};
