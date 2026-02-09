export type AtletaListagemDto = {
    id: string,
    nome: string,
    apelido: string,
    responsavel: string,
    dataNascimento: string,
    cidade: string,
    grupo: string,
    graduacao: string,
    criadoEm: string,
}

export type AtletaForm = {
    nome: string | undefined,
    apelido: string | undefined,
    responsavel: string | undefined,
    dataNascimento: string | undefined,
    cidade: string | undefined,
    grupo: string | undefined,
    graduacao: string | undefined,
    campeonatoId: string | undefined,
}