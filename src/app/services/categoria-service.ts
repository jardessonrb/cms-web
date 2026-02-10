import { CategoriaDto } from "../types/categoria";
import { ListParams } from "../types/default";
import { Page } from "../types/page";
import { api } from "./api";
import { Utils } from "./utils";

export const CategoriaService = { 
    async listaCategoriasDoCampeonato(campeonatoId: string, params: ListParams): Promise<Page<CategoriaDto>> {
        const paramsLimpos = Utils.removeChavesSemValor(params);
        console.log(paramsLimpos)
        const response = await api.get<Page<CategoriaDto>>(`/categoria/campeonato/${campeonatoId}`, {
            params: paramsLimpos,
        });

        return response.data;
    }, 
}