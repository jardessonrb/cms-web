import { api } from "./api";
import { Page } from "../types/page";
import { CampeonatoDetalhadoDto, CampeonatoDto, CampeonatoForm, CompartilhamentoDto } from "../types/campeonato";
import { ListParams } from "../types/default";


export const CampeonatoService = {
  async listar(parametros : ListParams): Promise<Page<CampeonatoDto>> {
    const response = await api.get<Page<CampeonatoDto>>("/campeonato", {
      params: parametros
    });
    return response.data;
  },
  async criaCampeonato(body: CampeonatoForm): Promise<CampeonatoDto> {
    const response = await api.post<CampeonatoDto>("/campeonato", body);
    return response.data;
  },
  async buscaCampeonatoPorId(campeonatoId: string): Promise<CampeonatoDetalhadoDto> {
    const response = await api.get<CampeonatoDetalhadoDto>(`/campeonato/${campeonatoId}`);
    return response.data;
  },
  async atualizarCampeonato(campeonatoId: string, body: CampeonatoForm): Promise<CampeonatoDto> {
    const response = await api.put<CampeonatoDto>(`/campeonato/${campeonatoId}`, body);
    return response.data;
  },
  async criarCompartilhamento(campeonatoId: string): Promise<CompartilhamentoDto> {
    const response = await api.post<CompartilhamentoDto>(`/campeonato/${campeonatoId}/criar-compartilhamento`);
    return response.data;
  },
  async buscarCompartilhamentoCampeonatos(campeonatoId: string): Promise<CompartilhamentoDto> {
    const response = await api.get<CompartilhamentoDto>(`/campeonato/${campeonatoId}/compartilhamento`);
    return response.data;
  },
  async desabilitarCompartilhamento(campeonatoId: string): Promise<CompartilhamentoDto> {
    const response = await api.put<CompartilhamentoDto>(`/campeonato/${campeonatoId}/desabilitar-compartilhamento`);
    return response.data;
  },
  async habilitarCompartilhamento(campeonatoId: string): Promise<CompartilhamentoDto> {
    const response = await api.put<CompartilhamentoDto>(`/campeonato/${campeonatoId}/habilitar-compartilhamento`);
    return response.data;
  },

};
