import { ListParams } from "@/types/default";
import { DisputaDto, RegistroDeNotasForm } from "@/types/disputa";
import { Page } from "@/types/page";
import { Utils } from "./utils";
import { api } from "./api";

export const DisputaService = {
  async buscaDisputasPorRodadaId(rodadaId: string, params: ListParams): Promise<DisputaDto[]> {
    const paramsLimpos = Utils.removeChavesSemValor(params);
    const response = await api.get<DisputaDto[]>(`/disputa/rodada/${rodadaId}`, {
      params: paramsLimpos,
    });
    return response.data;
  },
  async buscaDisputaPorId(disputaId: string): Promise<DisputaDto> {
    const response = await api.get<DisputaDto>(`/disputa/${disputaId}`);
    return response.data;
  },
  async registrarNotas(disputaId: string, registroNotasForm: RegistroDeNotasForm): Promise<DisputaDto> {
    const response = await api.post<DisputaDto>(`/disputa/${disputaId}/registrar-notas`, registroNotasForm);
    return response.data;
  }
}