export enum CriteriorEntradaEnum {
  TODOS = "Todos",
  N_PRIMEIROS = "N Primeiros",
}

export type FaseDto = {
    id: string
    nome: string
    situacao: string
    criterioEntrada: CriteriorEntradaEnum
    quantidadeAtletas: number
    quantidadeAtletasInscritos: number
}

export function getDescricaoCriteriorEntradaEnum(e: CriteriorEntradaEnum | undefined): string {
  if(e == undefined) return "";
  
  return CriteriorEntradaEnum[e.toString() as keyof typeof CriteriorEntradaEnum]
}