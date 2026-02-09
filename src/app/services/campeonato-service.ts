import { api } from "./api";
import { Page } from "../types/page";

export interface Campeonato {
  id: string;
  nome: string;
  situacao: "CRIADO" | "ABERTO" | "ENCERRADO";
  criadoEm: string;
}

export const CampeonatoService = {
  async listar(): Promise<Page<Campeonato>> {
    const response = await api.get<Page<Campeonato>>("/campeonato");
    return response.data;
  },
};
