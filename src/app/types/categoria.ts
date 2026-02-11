export type CategoriaDto = {
    id: string
    nome: string
    situacao: string
    criadoEm: string
}

export type CategoriaForm = {
    nome: string | undefined
    campeonatoId: string
}