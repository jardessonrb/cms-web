import { CategoriaDto, CategoriaForm, RankingGeralCategoriaDto } from "../types/categoria";
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
    async criaCategoria(body: CategoriaForm): Promise<CategoriaDto> {
        const response = await api.post<CategoriaDto>("/categoria", body);
        return response.data;
    },
    async buscaCategoriaPorId(categoriaId: string): Promise<CategoriaDto> {
        const response = await api.get<CategoriaDto>(`/categoria/${categoriaId}`);
        return response.data;
    },
    async inscreverAtletaEmCategoria(categoriaId: string, atletaId: string): Promise<void> {
        await api.post<void>(`/categoria/${categoriaId}/atleta/${atletaId}/inscrever`);
        return;
    },
    async atualizarCategoria(categoriaId: string, body: CategoriaForm): Promise<CategoriaDto> {
        const response = await api.put<CategoriaDto>(`/categoria/${categoriaId}`, body);
        return response.data;
    },
    async buscaRankingGeralCategoria(categoriaId: string): Promise<RankingGeralCategoriaDto[]> {
      const response = await api.get<RankingGeralCategoriaDto[]>(`/categoria/${categoriaId}/pontuacao-geral`);
      return response.data;
    },
}