export type CategoriaDto = {
    id: string
    nome: string
    situacao: string
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