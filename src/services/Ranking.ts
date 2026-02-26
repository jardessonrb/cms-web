import { RankingFaseDto } from "@/types/fase";
import { api } from "./api";


export const RankingService = {
  async buscaRankingFase(token: string): Promise<RankingFaseDto[]> {
  const response = await api.get<RankingFaseDto[]>(`/ranking/visualizacao`, {
    params: {
        token
    }
  });
  return response.data;
  },
}