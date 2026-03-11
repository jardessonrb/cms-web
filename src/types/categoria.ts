import { SituacaoAtletaEnum } from "./atleta"

export type CategoriaDto = {
    id: string
    nome: string
    situacao: SituacaoCategoriatoEnum
    criadoEm: string
    campeonatoId: string
    quantidadeAtletas: number | null
    quantidadeFases: number | null
}

export type RankingGeralCategoriaDto = {
    atletaId: string
    situacao: SituacaoAtletaEnum
    categoria: string
    competidor: string
    graduacao: string
    numeroCompetidor: number
    pontuacaoPorDupla: number
    pontuacaoPorAtleta: number
    totalGeral: number
    posicao: number
}

export type CategoriaForm =  {
    categoriaId: string | undefined
    nome: string | undefined
    campeonatoId: string
}

export enum SituacaoCategoriatoEnum {
  CRIADA = "Criada",
  INICIADA = "Iniciada",
  FINALIZADA = "Finalizada"
}

export function getDescricaoSituacaoCategoriaEnum(e: SituacaoCategoriatoEnum | undefined | null): string {
    if(e == undefined || e === null) return "";
    return SituacaoCategoriatoEnum[e.toString() as keyof typeof SituacaoCategoriatoEnum]
}
