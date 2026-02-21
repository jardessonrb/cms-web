export type CategoriaDto = {
    id: string
    nome: string
    situacao: SituacaoCategoriatoEnum
    criadoEm: string
    campeonatoId: string
    quantidadeAtletas: number | null
    quantidadeFases: number | null
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
