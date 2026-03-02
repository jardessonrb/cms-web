export enum CriteriorEntradaEnum {
  TODOS = "Todos",
  N_PRIMEIROS = "N Primeiros",
}

export type FaseDto = {
  id: string
  nome: string
  situacao: SituacaoFaseEnum
  criterioEntrada: CriterioEntradaEnum
  quantidadeAtletas: number
  quantidadeAtletasInscritos: number
  ordem: number
  quantidadeRodadas: number
  faseAnterior: FaseDto
  isCompartilhada: boolean
}

export type FaseForm = {
  nome: string | undefined
  criterioEntrada: string | undefined
  quantidadeAtletas: number | undefined
  categoriaId: string | undefined
  faseAnteriorId: string | undefined
}

export enum SituacaoFaseEnum {
  CRIADA = "Criada",
  INICIADA = "Iniciada",
  FINALIZADA = "Finalizada",
  AGUARDANDO_DESEMPATE = "Aguardando Desempate"
}

export type RankingFaseDto = {
  atletaId: number
  situacao: string
  categoria: string
  fase: string
  competidor: string
  numeroCompetidor: number
  partidas: number
  partidasConcluidas: number
  notaIndividual: number
  notaDupla: number
  total: number
  totalDesempate: number
  posicao: number
}

export type ValidacaoCorteDto = {
  quantidadeEmpatados:  number
  atletasEmpatados: AtletaEmpatadoDto[]
}

export type AtletaEmpatadoDto = {
  atletaUuid: string
  atletaNome: string
}

export enum CriterioEntradaEnum {
  TODOS = "Todos",
  N_PRIMEIROS = "N primeiros"
}

export function getDescricaoCriteriorEntradaEnum(e: CriterioEntradaEnum | undefined): string {
  if(e == undefined) return "";
  
  return CriterioEntradaEnum[e.toString() as keyof typeof CriterioEntradaEnum]
}


export function comparaCriteriosEntrada(e: CriterioEntradaEnum | undefined, e2: CriterioEntradaEnum | undefined): boolean {
  if((e === undefined && e2 != undefined) || (e != undefined && e2 === undefined)) return false;

  if(e === undefined && e2 === undefined) return true
  
  return getDescricaoCriteriorEntradaEnum(e).toUpperCase() === getDescricaoCriteriorEntradaEnum(e2).toUpperCase()
}


export function getDescricaoSituacaoFaseEnum(e: SituacaoFaseEnum | undefined): string {
  if(e == undefined) return "";
  
  return SituacaoFaseEnum[e.toString() as keyof typeof SituacaoFaseEnum]
}