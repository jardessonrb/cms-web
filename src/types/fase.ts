export enum SituacaoCampeonato {
  TODOS = "Todos",
  N_PRIMEIROS = "N Primeiros",
}

export type FaseDto = {
    id: string
    nome: string
    situacao: string
    criterioEntrada: SituacaoCampeonato
    quantidadeAtletas: number
    quantidadeAtletasInscritos: number
}