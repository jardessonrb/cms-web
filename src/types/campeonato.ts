export type CampeonatoDto = {
  id: string,
  nome: string,
  situacao: SituacaoCampeonatoEnum,
  criadoEm: string,
  nomeUsuarioCriador: string
}

export enum SituacaoCampeonatoEnum {
  CRIADO = "Criado",
  INICIADO = "Iniciado",
  FINALIZADO = "Finalizado"
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

export function getDescricaoSituacaoCampeonatoEnum(e: SituacaoCampeonatoEnum | undefined | null): string {
    if(e == undefined || e === null) return "";
    return SituacaoCampeonatoEnum[e.toString() as keyof typeof SituacaoCampeonatoEnum]
}


export type CompartilhamentoDto = {
  isHabilitado: boolean
  token: string
} 