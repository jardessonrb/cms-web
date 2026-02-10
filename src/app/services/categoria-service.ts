import { CategoriaDto, categoriaForm } from "../types/categoria";
import { ListParams } from "../types/default";
import { Page } from "../types/page";
import { api } from "./api";
import { Utils } from "./utils";

export const CategoriaService = { 
    async listaCategoriasDoCampeonato(campeonatoId: string, params: ListParams): Promise<Page<CategoriaDto>> {
        const paramsLimpos = Utils.removeChavesSemValor(params);
        const response = await api.get<Page<CategoriaDto>>(`/categoria/campeonato/${campeonatoId}`, {
            params: paramsLimpos,
        });

        return response.data;
    }, 
    async criaCategoria(body: categoriaForm): Promise<CategoriaDto> {
    const response = await api.post<CategoriaDto>("/categoria", body);
    return response.data;
    },
}