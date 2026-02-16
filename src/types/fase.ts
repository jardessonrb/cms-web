export enum CriteriorEntradaEnum {
  TODOS = "Todos",
  N_PRIMEIROS = "N Primeiros",
}

export type FaseDto = {
    id: string
    nome: string
    situacao: string
    criterioEntrada: CriterioEntradaEnum
    quantidadeAtletas: number
    quantidadeAtletasInscritos: number
    ordem: number
}

export type FaseForm = {
  nome: string | undefined
  criterioEntrada: string | undefined
  quantidadeAtletas: number | undefined
  categoriaId: string | undefined
  faseAnterior: string | undefined
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