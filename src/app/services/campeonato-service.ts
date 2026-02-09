import { api } from "./api";
import { Page } from "../types/page";

export interface Campeonato {
  id: string;
  nome: string;
  situacao: "CRIADO" | "ABERTO" | "ENCERRADO";
  criadoEm: string;
}

export interface Params {
  page: number,
  size: number
}

export const CampeonatoService = {
  async listar(parametros : Params): Promise<Page<Campeonato>> {
    const response = await api.get<Page<Campeonato>>("/campeonato", {
      params: parametros
    });
    return response.data;
  },

  async criaCampeonato(body: any): Promise<Campeonato> {
    const response = await api.post<Campeonato>("/campeonato", body);
    return response.data;
  },
};
