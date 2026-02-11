import { ListParams } from "../types/default";
import { JuradoDto, JuradoForm } from "../types/jurado";
import { Page } from "../types/page";
import { api } from "./api";
import { Utils } from "./utils";

export const JuradoService = { 
    async listaJuradosDoCampeonato(campeonatoId: string, params: ListParams): Promise<Page<JuradoDto>> {
        const paramsLimpos = Utils.removeChavesSemValor(params);
        const response = await api.get<Page<JuradoDto>>(`/jurado/campeonato/${campeonatoId}`, {
            params: paramsLimpos,
        });

        return response.data;
    }, 
    async criaJurado(body: JuradoForm): Promise<JuradoDto> {
        const response = await api.post<JuradoDto>("/jurado", body);
        return response.data;
    },
}