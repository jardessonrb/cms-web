import { ListParams } from "@/types/default";
import { Utils } from "./utils";
import { api } from "./api";
import { Page } from "@/types/page";
import { FaseDto, FaseForm, RankingFaseDto, ValidacaoCorteDto } from "@/types/fase";

export const FaseService = {
  async listaFasesPorCategoriaId(categoriaId: string, params: ListParams): Promise<Page<FaseDto>> {
    const paramsLimpos = Utils.removeChavesSemValor(params);
    const response = await api.get<Page<FaseDto>>(`/fase/categoria/${categoriaId}`, {
      params: paramsLimpos,
    });
    return response.data;
  },
  async buscaFasePorId(faseId: string): Promise<FaseDto> {
    const response = await api.get<FaseDto>(`/fase/${faseId}`);
    return response.data;
  },
  async criarFase(body: Partial<FaseForm>): Promise<FaseDto> {
      const response = await api.post<FaseDto>("/fase", body);
      return response.data;
  },
  async buscaRankingFase(faseId: string): Promise<RankingFaseDto[]> {
  const response = await api.get<RankingFaseDto[]>(`/fase/${faseId}/pontuacao-parcial`);
  return response.data;
  },
  async finalizarFase(faseId: string): Promise<FaseDto> {
    const response = await api.put<FaseDto>(`/fase/${faseId}/finalizar`);
    return response.data;
  },
  async validarCorteNovaFase(faseAnteriorId: string, quantidadeAtletas: number): Promise<ValidacaoCorteDto> {
      const response = await api.post<ValidacaoCorteDto>(`/fase/fase-anterior/${faseAnteriorId}/atletas/${quantidadeAtletas}/validar-corte`, {});
      return response.data;
  },
  async desabilitarCompartilhamento(faseId: string): Promise<FaseDto> {
    const response = await api.put<FaseDto>(`/fase/${faseId}/parar-compartilhamento`);
    return response.data;
  },
  async habilitarCompartilhamento(faseId: string): Promise<FaseDto> {
    const response = await api.put<FaseDto>(`/fase/${faseId}/compartilhar`);
    return response.data;
  },
  async adicionarAtletaNaFase(faseId: string, atletaId: string): Promise<void> {
    const response = await api.post<FaseDto>(`/fase/${faseId}/atleta/${atletaId}/adicionar`);
    return;
  },
  
}