export type CampeonatoDto = {
  id: string,
  nome: string,
  situacao: "CRIADO" | "INICIADO" | "FINALIZADO",
  criadoEm: string,
}

export type CampeonatoForm = {
  campeonatoId?: string
  nome: string | undefined
}

export type CampeonatoDetalhadoDto = CampeonatoDto & {
  quantidadeAtletas: number,
  quantidadeCategorias: number,
  quantidadeJurados: number
}
