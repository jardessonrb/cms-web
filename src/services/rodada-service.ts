import { ListParams } from "@/types/default";
import { Page } from "@/types/page";
import { RodadaDto } from "@/types/roda";
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
  }
}