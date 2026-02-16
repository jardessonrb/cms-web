import { ListParams } from "@/types/default";
import { Utils } from "./utils";
import { api } from "./api";
import { Page } from "@/types/page";
import { FaseDto, FaseForm } from "@/types/fase";

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
}