export type JuradoDto = {
    id: string
    nome: string
    apelido: string
    grupo: string
}

export type JuradoForm = {
    juradoId: string | undefined
    nome: string | undefined,
    apelido: string | undefined,
    grupo: string | undefined,
    campeonatoId: string,
}