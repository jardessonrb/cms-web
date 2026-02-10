export type CategoriaDto = {
    id: string
    nome: string
    situacao: string
    criadoEm: string
}

export type categoriaForm = {
    nome: string | undefined
    campeonatoId: string
}