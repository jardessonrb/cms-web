import { api } from "./api";
import { Page } from "../types/page";
import { AtletaForm, AtletaListagemDto, RetornoImportacaoAtletasDto } from "../types/atleta";
import { Utils } from "./utils";
import { ListParams } from "../types/default";

export interface Atleta {
  id: string;
  nome: string;
  idade?: number;
  categoria?: string;
  situacao?: "ATIVO" | "INATIVO";
  criadoEm?: string;
}


export const AtletaService = {
  async listaAtletasDoCampeonato(campeonatoId: string, params: ListParams): Promise<Page<AtletaListagemDto>> {
    const paramsLimpos = Utils.removeChavesSemValor(params);
    const response = await api.get<Page<AtletaListagemDto>>(`/atleta/campeonato/${campeonatoId}`, {
      params: paramsLimpos,
    });
    return response.data;
  },

  async buscarPorId(id: string): Promise<Atleta> {
    const response = await api.get<Atleta>(`/atleta/${id}`);
    return response.data;
  },

  async criar(body: Partial<AtletaForm>): Promise<Atleta> {
    const response = await api.post<Atleta>("/atleta", body);
    return response.data;
  },

  async atualizar(id: string, body: Partial<Atleta>): Promise<Atleta> {
    const response = await api.put<Atleta>(`/atleta/${id}`, body);
    return response.data;
  },

  async listaAtletasDaCategoria(categoriaId: string, params: ListParams): Promise<Page<AtletaListagemDto>> {
    const paramsLimpos = Utils.removeChavesSemValor(params);
    const response = await api.get<Page<AtletaListagemDto>>(`/atleta/categoria/${categoriaId}`, {
      params: paramsLimpos,
    });
    return response.data;
  },
  async listaAtletaPorFase(faseId: string, params: ListParams): Promise<Page<AtletaListagemDto>> {
    const paramsLimpos = Utils.removeChavesSemValor(params);
    const response = await api.get<Page<AtletaListagemDto>>(`/atleta/fase/${faseId}`, {
      params: paramsLimpos,
    });
    return response.data;
  },
  async importarCSV(campeonatoId: string, file: File): Promise<RetornoImportacaoAtletasDto> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<RetornoImportacaoAtletasDto>(`/atleta/campeonato/${campeonatoId}/importar`,
      formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;
  },
  async cancelarAtleta(atletaId: string): Promise<void> {
    const response = await api.put<void>(`/atleta/${atletaId}/cancelar`);
    return response.data;
  },
};
