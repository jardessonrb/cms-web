export interface Campeonato {
  id: string;
  nome: string;
  situacao: "CRIADO" | "INICIADO" | "FINALIZADO";
  criadoEm: string;
}
