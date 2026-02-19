import { ListParams } from "@/types/default";
import { Page } from "@/types/page";
import { GeracaoRodadaForm, RodadaDto } from "@/types/roda";
import { Utils } from "./utils";
import { api } from "./api";

export const RodadaService = {
  async listaRodadaPorFaseId(faseId: string, params: ListParams): Promise<Page<RodadaDto>> {
    const paramsLimpos = Utils.removeChavesSemValor(params);
    const response = await api.get<Page<RodadaDto>>(`/rodada/fase/${faseId}`, {
      params: paramsLimpos,
    });
    return response.data;
  },
  async finalizarRodada(rodadaId: string): Promise<RodadaDto> {
    const response = await api.put<RodadaDto>(`/rodada/${rodadaId}/finalizar`);
    return response.data;
  },
  async gerarRodadas(faseId: string, rodadasForms: GeracaoRodadaForm[]): Promise<RodadaDto[]> {
    const response = await api.post<RodadaDto[]>(`/rodada/fase/${faseId}/gerar-rodadas`, rodadasForms);
    return response.data;
  },
  async criarNovaRodada(rodadaForm: GeracaoRodadaForm): Promise<RodadaDto> {
    const response = await api.post<RodadaDto>(`/rodada`, rodadaForm);
    return response.data;
  }
}